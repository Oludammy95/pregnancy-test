// pages/api/molar.js
import { spawn } from "child_process";
import path from "path";
import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb"; // 👈 make sure this points to your connector

export async function POST(request) {
  try {
    const formData = await request.json();
    console.log("📥 Received Molar form data:", JSON.stringify(formData, null, 2));

    // --- DOMAIN VALIDATION RULES ---
    const age = parseInt(formData.age, 10);
    const gravida = parseInt(formData.gravida, 10);
    const parity = parseInt(formData.parity, 10);
    const abortions = parseInt(formData.abortions, 10);

    const errors = [];
    if (isNaN(age) || age < 15 || age > 49) {
      errors.push("Age must be between 15 and 49 years.");
    }
    if (gravida < 0 || parity < 0 || abortions < 0) {
      errors.push("Gravida, parity, and abortions must be non-negative.");
    }
    if (parity > gravida) {
      errors.push("Parity cannot exceed gravida.");
    }
    if (abortions > gravida) {
      errors.push("Abortions cannot exceed gravida.");
    }
    if (parity + abortions > gravida) {
      errors.push("Parity + abortions cannot exceed gravida.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: "Invalid input", details: errors }, { status: 400 });
    }

    // --- ASSIGN UNIQUE PATIENT ID ---
    if (!formData.PatientID) {
      formData.PatientID = Date.now();
    }

    // --- SAVE TO MONGODB ---
    try {
      const client = await clientPromise;
      const db = client.db("pregnancy_system"); // 👈 database name
      const collection = db.collection("molar_cases"); // 👈 collection name

      await collection.insertOne({
        ...formData,
        createdAt: new Date(),
      });

      console.log("✅ Saved Molar form data to MongoDB");
    } catch (dbError) {
      console.error("❌ MongoDB error:", dbError.message);
    }

    // --- Locate Python script ---
    const possiblePaths = [
      path.join(process.cwd(), "python", "model_predictor.py"),
      path.join(process.cwd(), "model_predictor.py"),
      path.join(process.cwd(), "scripts", "model_predictor.py"),
    ];

    let pythonScript = null;
    const fs = await import("fs");
    for (const scriptPath of possiblePaths) {
      if (fs.existsSync(scriptPath)) {
        pythonScript = scriptPath;
        break;
      }
    }

    if (!pythonScript) {
      return NextResponse.json(
        { error: "Python script not found", searchedPaths: possiblePaths },
        { status: 500 }
      );
    }

    // --- Auto-detect Python interpreter ---
    const pythonCandidates = process.platform === "win32"
      ? ["python", "py", "python3"]
      : ["python3", "python"];
    let pythonCmd = null;

    for (const candidate of pythonCandidates) {
      try {
        const check = spawn(candidate, ["--version"]);
        await new Promise((resolve, reject) => {
          check.on("exit", (code) => {
            if (code === 0) {
              pythonCmd = candidate;
              resolve();
            } else reject();
          });
          check.on("error", reject);
        });
        if (pythonCmd) break;
      } catch {}
    }

    if (!pythonCmd) {
      return NextResponse.json({ error: "No valid Python interpreter found" }, { status: 500 });
    }

    // --- Run Python script ---
    const python = spawn(pythonCmd, [pythonScript, "molar", JSON.stringify(formData)], {
      cwd: process.cwd(),
      env: { ...process.env, PYTHONUNBUFFERED: "1" },
    });

    let dataString = "";
    let errorString = "";

    python.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorString += data.toString();
    });

    return new Promise((resolve) => {
      python.on("close", (code) => {
        if (code !== 0) {
          return resolve(
            NextResponse.json(
              { error: "Prediction failed", details: errorString, exitCode: code },
              { status: 500 }
            )
          );
        }

        try {
          const cleanOutput = dataString.trim();
          const lines = cleanOutput.split("\n");
          const jsonLine = lines[lines.length - 1];
          const result = JSON.parse(jsonLine);

          resolve(
            NextResponse.json({
              success: true,
              result,
              debug: { pythonScript, pythonCmd, formDataReceived: formData },
            })
          );
        } catch (err) {
          resolve(
            NextResponse.json(
              { error: "Failed to parse prediction result", details: err.message, rawOutput: dataString },
              { status: 500 }
            )
          );
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
