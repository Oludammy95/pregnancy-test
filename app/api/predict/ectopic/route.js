import { spawn } from "child_process";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.json();

    // Log the incoming request for debugging
    console.log("Received form data:", JSON.stringify(formData, null, 2));

    // Instead of requiring ALL fields, just validate that we have some essential data
    const essentialFields = ["age"]; // At minimum, we should have age

    for (const field of essentialFields) {
      if (!formData[field] && formData[field] !== 0) {
        return NextResponse.json(
          {
            error: `Essential field missing: ${field}. At minimum, patient age is required.`,
          },
          { status: 400 }
        );
      }
    }

    // Add PatientID if not provided
    if (!formData.PatientID) {
      formData.PatientID = Date.now(); // Use timestamp as simple ID
    }

    // Determine the correct Python script path
    const possiblePaths = [
      path.join(process.cwd(), "python", "model_predictor.py"),
      path.join(process.cwd(), "model_predictor.py"),
      path.join(process.cwd(), "scripts", "model_predictor.py"),
      path.join(process.cwd(), "src", "model_predictor.py"),
      path.join(process.cwd(), "lib", "model_predictor.py"),
    ];

    let pythonScript = null;

    // Check which path exists
    const fs = await import("fs");
    for (const scriptPath of possiblePaths) {
      try {
        if (fs.existsSync(scriptPath)) {
          pythonScript = scriptPath;
          console.log("Found Python script at:", scriptPath);
          break;
        }
      } catch (e) {
        // Continue to next path
      }
    }

    if (!pythonScript) {
      console.error(
        "Python script not found in any of these locations:",
        possiblePaths
      );
      return NextResponse.json(
        {
          error: "Python script not found",
          details: "model_predictor.py not found in expected locations",
          searchedPaths: possiblePaths,
        },
        { status: 500 }
      );
    }

    // Try different Python commands
    const pythonCommands = ["python3", "python", "py"];
    let pythonCmd = "python3"; // default

    console.log(`Calling Python script: ${pythonCmd} ${pythonScript} ectopic`);
    console.log(`Form data: ${JSON.stringify(formData)}`);

    const python = spawn(
      pythonCmd,
      [pythonScript, "ectopic", JSON.stringify(formData)],
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
            {
              error: "Failed to start Python process",
              details: err.message,
            },
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
              {
                error: "Prediction failed",
                details: errorString,
                exitCode: code,
              },
              { status: 500 }
            )
          );
          return;
        }

        try {
          // Clean the output - sometimes there's extra logging
          const cleanOutput = dataString.trim();
          const lines = cleanOutput.split("\n");
          const jsonLine = lines[lines.length - 1]; // Last line should be the JSON result

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
                pythonOutput: errorString.includes("Info:")
                  ? errorString
                  : null,
              },
            })
          );
        } catch (parseError) {
          console.error("Parse error:", parseError);
          console.error("Raw output:", dataString);
          console.error("Attempting to parse:", dataString.trim());

          resolve(
            NextResponse.json(
              {
                error: "Failed to parse prediction result",
                details: parseError.message,
                rawOutput: dataString,
                stderr: errorString,
              },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
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
