import { spawn } from "child_process";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.json();

    // Log the incoming request for debugging
    console.log("Received form data:", JSON.stringify(formData, null, 2));

    // -------------------------------
    // VALIDATION RULES
    // -------------------------------
    const {
      age,
      gravida,
      parity,
      abortions,
      historyOfMiscarriages,
      historyOfMolarPregnancy,
      numberOfMiscarriages,
    } = formData;

    // 1. Essential fields check
    const essentialFields = [
      "age",
      "gravida",
      "parity",
      "historyOfMiscarriages",
      "historyOfMolarPregnancy",
    ];
    for (const field of essentialFields) {
      if (formData[field] === undefined || formData[field] === null || formData[field] === "") {
        return NextResponse.json(
          { error: `Essential field missing: ${field}.` },
          { status: 400 }
        );
      }
    }

    // Convert numeric inputs safely
    const ageNum = Number(age);
    const gravidaNum = Number(gravida);
    const parityNum = Number(parity);
    const abortionsNum = abortions ? Number(abortions) : 0;
    const numberOfMiscarriagesNum = numberOfMiscarriages ? Number(numberOfMiscarriages) : 0;

    // 2. Age must be between 15–49
    if (isNaN(ageNum) || ageNum < 15 || ageNum > 49) {
      return NextResponse.json(
        { error: "Age must be a number between 15 and 49 years." },
        { status: 400 }
      );
    }

    // 3. Gravida must be ≥ 0
    if (isNaN(gravidaNum) || gravidaNum < 0) {
      return NextResponse.json(
        { error: "Gravida must be a valid number (≥ 0)." },
        { status: 400 }
      );
    }

    // 4. Parity ≤ Gravida
    if (parityNum > gravidaNum) {
      return NextResponse.json(
        { error: "Parity cannot be greater than Gravida." },
        { status: 400 }
      );
    }

    // 5. Abortions ≤ Gravida
    if (abortionsNum > gravidaNum) {
      return NextResponse.json(
        { error: "Abortions cannot be greater than Gravida." },
        { status: 400 }
      );
    }

    // 6. Gravida ≥ Parity + Abortions
    if (gravidaNum < parityNum + abortionsNum) {
      return NextResponse.json(
        { error: "Gravida must be greater than or equal to Parity + Abortions." },
        { status: 400 }
      );
    }

    // 7. History of Miscarriages must be yes/no
    if (!["yes", "no"].includes(String(historyOfMiscarriages).toLowerCase())) {
      return NextResponse.json(
        { error: "History of Miscarriages must be either 'yes' or 'no'." },
        { status: 400 }
      );
    }

    // 8. History of Molar Pregnancy must be yes/no
    if (!["yes", "no"].includes(String(historyOfMolarPregnancy).toLowerCase())) {
      return NextResponse.json(
        { error: "History of Molar Pregnancy must be either 'yes' or 'no'." },
        { status: 400 }
      );
    }

    // 9. If never pregnant (Gravida = 0), cannot have history of miscarriages or molar pregnancy
    if (gravidaNum === 0) {
      if (String(historyOfMiscarriages).toLowerCase() === "yes") {
        return NextResponse.json(
          { error: "A person who has never been pregnant (Gravida = 0) cannot have a history of miscarriages." },
          { status: 400 }
        );
      }
      if (String(historyOfMolarPregnancy).toLowerCase() === "yes") {
        return NextResponse.json(
          { error: "A person who has never been pregnant (Gravida = 0) cannot have a history of molar pregnancy." },
          { status: 400 }
        );
      }
    }

    // 10. Number of miscarriages validation
    if (numberOfMiscarriages !== undefined && numberOfMiscarriages !== null && numberOfMiscarriages !== "") {
      if (isNaN(numberOfMiscarriagesNum) || numberOfMiscarriagesNum < 0) {
        return NextResponse.json(
          { error: "Number of miscarriages must be a valid number (≥ 0)." },
          { status: 400 }
        );
      }

      // Number of miscarriages cannot be more than gravida
      if (numberOfMiscarriagesNum > gravidaNum) {
        return NextResponse.json(
          { error: "Number of miscarriages cannot be greater than Gravida." },
          { status: 400 }
        );
      }

      // If they said "yes" to history of miscarriages, they must specify the number
      if (String(historyOfMiscarriages).toLowerCase() === "yes" && numberOfMiscarriagesNum === 0) {
        return NextResponse.json(
          { error: "If you have a history of miscarriages, the number of miscarriages must be greater than 0." },
          { status: 400 }
        );
      }

      // If they said "no" to history of miscarriages, number should be 0
      if (String(historyOfMiscarriages).toLowerCase() === "no" && numberOfMiscarriagesNum > 0) {
        return NextResponse.json(
          { error: "If you have no history of miscarriages, the number of miscarriages should be 0." },
          { status: 400 }
        );
      }

      // Total pregnancies logic: Gravida should equal Parity + Abortions + Miscarriages + Current pregnancy
      // For this assessment, we assume current pregnancy = 1, so:
      // Gravida should be ≥ Parity + Abortions + Miscarriages
      const totalPreviousPregnancies = parityNum + abortionsNum + numberOfMiscarriagesNum;
      if (gravidaNum < totalPreviousPregnancies) {
        return NextResponse.json(
          { error: `Gravida (${gravidaNum}) cannot be less than the sum of Parity (${parityNum}) + Abortions (${abortionsNum}) + Miscarriages (${numberOfMiscarriagesNum}) = ${totalPreviousPregnancies}.` },
          { status: 400 }
        );
      }
    }

    // 11. If they said "yes" to history of miscarriages but didn't provide a number
    if (String(historyOfMiscarriages).toLowerCase() === "yes" && (!numberOfMiscarriages || numberOfMiscarriages === "" || numberOfMiscarriagesNum === 0)) {
      return NextResponse.json(
        { error: "Please specify the number of miscarriages since you indicated having a history of miscarriages." },
        { status: 400 }
      );
    }

    // Optional: Clean up empty strings to undefined
    Object.keys(formData).forEach((key) => {
      if (formData[key] === "") {
        formData[key] = undefined;
      }
    });

    // Add PatientID if not provided
    if (!formData.PatientID) {
      formData.PatientID = Date.now(); // Use timestamp as simple ID
    }

    // -------------------------------
    // Find Python script
    // -------------------------------
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
          console.log("Found Python script at:", scriptPath);
          break;
        }
      } catch (e) {
        // Continue
      }
    }

    if (!pythonScript) {
      console.error("Python script not found in any of these locations:", possiblePaths);
      return NextResponse.json(
        { error: "Python script not found", searchedPaths: possiblePaths },
        { status: 500 }
      );
    }

    // -------------------------------
    // Select a valid Python executable
    // -------------------------------
    const pythonCommands = ["python3", "python", "py"];
    let pythonCmd = null;

    for (const cmd of pythonCommands) {
      try {
        const check = spawn(cmd, ["--version"]);
        await new Promise((resolve, reject) => {
          check.on("exit", (code) => (code === 0 ? resolve(true) : reject()));
          check.on("error", reject);
        });
        pythonCmd = cmd;
        console.log(`Using Python command: ${cmd}`);
        break;
      } catch {
        continue;
      }
    }

    if (!pythonCmd) {
      return NextResponse.json(
        { error: "No valid Python interpreter found", tried: pythonCommands },
        { status: 500 }
      );
    }

    console.log(`Calling Python script: ${pythonCmd} ${pythonScript} molar`);
    console.log(`Form data: ${JSON.stringify(formData)}`);

    // -------------------------------
    // Spawn Python process
    // -------------------------------
    const python = spawn(
      pythonCmd,
      [pythonScript, "molar", JSON.stringify(formData)],
      {
        cwd: process.cwd(),
        env: { ...process.env, PYTHONUNBUFFERED: "1" },
      }
    );

    let dataString = "";
    let errorString = "";

    python.stdout.on("data", (data) => {
      const chunk = data.toString();
      console.log("Python stdout:", chunk);
      dataString += chunk;
    });

    python.stderr.on("data", (data) => {
      const chunk = data.toString();
      console.log("Python stderr:", chunk);
      errorString += chunk;
    });

    return new Promise((resolve) => {
      python.on("error", (err) => {
        console.error("Failed to start Python process:", err);
        resolve(
          NextResponse.json(
            { error: "Failed to start Python process", details: err.message },
            { status: 500 }
          )
        );
      });

      python.on("close", (code) => {
        console.log(`Python process exited with code: ${code}`);
        console.log(`Full stdout: ${dataString}`);
        console.log(`Full stderr: ${errorString}`);

        if (code !== 0) {
          console.error("Python script error:", errorString);
          resolve(
            NextResponse.json(
              { error: "Prediction failed", details: errorString, exitCode: code },
              { status: 500 }
            )
          );
          return;
        }

        try {
          const cleanOutput = dataString.trim();
          const lines = cleanOutput.split("\n");
          const jsonLine = lines[lines.length - 1]; // Last line should be JSON

          console.log("Attempting to parse JSON:", jsonLine);
          const result = JSON.parse(jsonLine);

          if (result.error) {
            resolve(NextResponse.json(result, { status: 400 }));
            return;
          }

          resolve(
            NextResponse.json({
              success: true,
              result: result,
              debug: {
                pythonScript,
                formDataReceived: formData,
                pythonOutput: errorString.includes("Info:") ? errorString : null,
              },
            })
          );
        } catch (parseError) {
          console.error("Parse error:", parseError);
          console.error("Raw output:", dataString);

          resolve(
            NextResponse.json(
              { error: "Failed to parse prediction result", details: parseError.message, rawOutput: dataString, stderr: errorString },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
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