import { spawn } from "child_process";
import path from "path";

export default async function handler(req, res) {
  // Enable CORS if needed
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const formData = req.body;

    // Log the incoming request for debugging
    console.log("Received molar form data:", JSON.stringify(formData, null, 2));

    // Instead of requiring ALL fields, just validate that we have some essential data
    // The Python script will handle missing fields with defaults
    const essentialFields = ["age"]; // At minimum, we should have age

    for (const field of essentialFields) {
      if (!formData[field] && formData[field] !== 0) {
        return res.status(400).json({
          error: `Essential field missing: ${field}. At minimum, patient age is required.`,
        });
      }
    }

    // Add PatientID if not provided
    if (!formData.PatientID) {
      formData.PatientID = Date.now(); // Use timestamp as simple ID
    }

    // Determine the correct Python script path
    // Try multiple possible locations
    const possiblePaths = [
      path.join(process.cwd(), "python", "model_predictor.py"),
      path.join(process.cwd(), "model_predictor.py"),
      path.join(process.cwd(), "scripts", "model_predictor.py"),
      path.join(__dirname, "model_predictor.py"),
      path.join(__dirname, "..", "python", "model_predictor.py"),
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
      return res.status(500).json({
        error: "Python script not found",
        details: "model_predictor.py not found in expected locations",
        searchedPaths: possiblePaths,
      });
    }

    // Try different Python commands
    const pythonCommands = ["python3", "python", "py"];
    let pythonCmd = "python3"; // default

    console.log(
      `Calling Python script for molar: ${pythonCmd} ${pythonScript} molar`
    );
    console.log(`Form data: ${JSON.stringify(formData)}`);

    const python = spawn(
      pythonCmd,
      [
        pythonScript,
        "molar", // Changed from "ectopic" to "molar"
        JSON.stringify(formData),
      ],
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

    python.on("error", (err) => {
      console.error("Failed to start Python process:", err);
      return res.status(500).json({
        error: "Failed to start Python process",
        details: err.message,
      });
    });

    python.on("close", (code) => {
      console.log(`Python process exited with code: ${code}`);
      console.log(`Full stdout: ${dataString}`);
      console.log(`Full stderr: ${errorString}`);

      if (code !== 0) {
        console.error("Python script error:", errorString);
        return res.status(500).json({
          error: "Molar pregnancy prediction failed",
          details: errorString,
          exitCode: code,
        });
      }

      try {
        // Clean the output - sometimes there's extra logging
        const cleanOutput = dataString.trim();
        const lines = cleanOutput.split("\n");
        const jsonLine = lines[lines.length - 1]; // Last line should be the JSON result

        console.log("Attempting to parse JSON:", jsonLine);

        const result = JSON.parse(jsonLine);

        if (result.error) {
          return res.status(400).json(result);
        }

        res.status(200).json({
          success: true,
          result: result,
          predictionType: "molar",
          debug: {
            pythonScript,
            formDataReceived: formData,
            pythonOutput: errorString.includes("Info:") ? errorString : null,
          },
        });
      } catch (parseError) {
        console.error("Parse error:", parseError);
        console.error("Raw output:", dataString);
        console.error("Attempting to parse:", dataString.trim());

        res.status(500).json({
          error: "Failed to parse molar pregnancy prediction result",
          details: parseError.message,
          rawOutput: dataString,
          stderr: errorString,
        });
      }
    });
  } catch (error) {
    console.error("Molar API Error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
