import { spawn } from "child_process";
import path from "path";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // connection helper

export async function POST(request) {
  try {
    const formData = await request.json();
    console.log("Received form data:", JSON.stringify(formData, null, 2));

    // --- DOMAIN VALIDATION RULES ---
    const age = parseInt(formData.age, 10);
    const gravidity = parseInt(formData.gravidity, 10);
    const parity = parseInt(formData.parity, 10);
    const abortions = parseInt(formData.abortions, 10);
    const historyOfEctopicPregnancy = formData.historyOfEctopicPregnancy; // "Yes" or "No"

    const errors = [];
    if (isNaN(age) || age < 15 || age > 49) errors.push("Age must be between 15 and 49 years.");
    if (gravidity < 0 || parity < 0 || abortions < 0) errors.push("Gravidity, parity, and abortions must be non-negative.");
    if (parity > gravidity) errors.push("Parity cannot exceed gravidity.");
    if (abortions > gravidity) errors.push("Abortions cannot exceed gravidity.");
    if (parity + abortions > gravidity) errors.push("Parity + abortions cannot exceed gravidity.");
    if (gravidity === 0 && parity === 0 && historyOfEctopicPregnancy !== "No") {
      errors.push("If gravidity and parity are both 0, history of ectopic pregnancy must be 'No'.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: "Invalid input", details: errors }, { status: 400 });
    }

    // Assign PatientID if missing
    if (!formData.PatientID) formData.PatientID = Date.now();

    // --- Save input to MongoDB first ---
    const client = await clientPromise;
    const db = client.db("pregnancyDB");
    const collection = db.collection("ectopic_cases");

    const insertResult = await collection.insertOne({
      ...formData,
      createdAt: new Date(),
      prediction: null, // will update later
    });

    const recordId = insertResult.insertedId;

    // --- Locate Python script ---
    const possiblePaths = [
      path.join(process.cwd(), "python", "model_predictor.py"),
      path.join(process.cwd(), "model_predictor.py"),
      path.join(process.cwd(), "scripts", "model_predictor.py"),
      path.join(process.cwd(), "src", "model_predictor.py"),
      path.join(process.cwd(), "lib", "model_predictor.py"),
    ];

    let pythonScript = null;
    const fs = await import("fs");
    for (const scriptPath of possiblePaths) {
      try {
        if (fs.existsSync(scriptPath)) {
          pythonScript = scriptPath;
          break;
        }
      } catch {}
    }

    if (!pythonScript) {
      return NextResponse.json({ error: "Python script not found", searchedPaths: possiblePaths }, { status: 500 });
    }

    // --- Auto-detect Python interpreter ---
    const pythonCandidates = process.platform === "win32" ? ["python", "py", "python3"] : ["python3", "python"];
    let pythonCmd = null;
    for (const candidate of pythonCandidates) {
      try {
        const check = spawn(candidate, ["--version"]);
        await new Promise((resolve, reject) => {
          check.on("exit", (code) => (code === 0 ? (pythonCmd = candidate, resolve()) : reject()));
          check.on("error", reject);
        });
        if (pythonCmd) break;
      } catch {}
    }
    if (!pythonCmd) {
      return NextResponse.json({ error: "No valid Python interpreter found" }, { status: 500 });
    }

    console.log(`Calling Python script: ${pythonCmd} ${pythonScript} ectopic`);

    const python = spawn(
      pythonCmd,
      [pythonScript, "ectopic", JSON.stringify(formData)],
      { cwd: process.cwd(), env: { ...process.env, PYTHONUNBUFFERED: "1" } }
    );

    let dataString = "";
    let errorString = "";

    python.stdout.on("data", (data) => { dataString += data.toString(); });
    python.stderr.on("data", (data) => { errorString += data.toString(); });

    return new Promise((resolve) => {
      python.on("close", async (code) => {
        if (code !== 0) {
          return resolve(NextResponse.json(
            { error: "Prediction failed", details: errorString, exitCode: code },
            { status: 500 }
          ));
        }

        try {
          const cleanOutput = dataString.trim();
          const lines = cleanOutput.split("\n");
          const jsonLine = lines[lines.length - 1];
          const result = JSON.parse(jsonLine);

          // --- Update MongoDB record with prediction ---
          await collection.updateOne(
            { _id: recordId },
            { $set: { prediction: result, updatedAt: new Date() } }
          );

          resolve(NextResponse.json({
            success: true,
            result,
            debug: { pythonScript, pythonCmd, formDataReceived: formData },
          }));
        } catch (err) {
          resolve(NextResponse.json(
            { error: "Failed to parse prediction result", details: err.message, rawOutput: dataString, stderr: errorString },
            { status: 500 }
          ));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
