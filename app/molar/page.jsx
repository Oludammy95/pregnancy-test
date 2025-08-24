"use client";
import { useState } from "react";
import Layout from "../../components/Header";
import FormInput from "../../components/FormInput";
import FormSection from "../../components/FormSection";
import {
  UserIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  HeartIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

const MolarPregnancy = () => {
  const [formData, setFormData] = useState({
    // Patient Demographics
    age: "",
    gravida: "",
    parity: "",
    historyOfMolarPregnancy: "",
    historyOfMiscarriages: "",
    numberOfMiscarriages: "",

    // Presenting Symptoms
    vaginalBleeding: "",
    excessiveNausea: "",
    pelvicPain: "",
    passageOfVesicles: "",
    uterineSizeLarger: "",

    // Laboratory Data
    quantitativeHCG: "",
    bloodGroup: "",
    rhStatus: "",
    thyroidFunction: "",

    // Ultrasound Findings
    gestationalSacPresent: "",
    fetalHeartbeat: "",
    snowstormAppearance: "",
    ovarianCysts: "",

    // Other Risk Factors
    assistedReproduction: "",
    smokingAlcohol: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [dbMessage, setDbMessage] = useState(""); // ✅ feedback for MongoDB save

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDbMessage("");

    try {
      // 1️⃣ Save to MongoDB via API
      const dbRes = await fetch("/api/molar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const dbData = await dbRes.json();

      if (dbRes.ok) {
        setDbMessage("✅ Data saved to database successfully!");
      } else {
        setDbMessage("❌ Failed to save to database: " + (dbData.error || ""));
      }

      // 2️⃣ Run prediction
      const { predictMolar } = await import("../../utils/api");
      const response = await predictMolar(formData);

      if (response.success) {
        setResult(response.result);
      } else {
        setResult({
          riskLevel: "Error",
          percentage: "N/A",
          recommendations: ["Unable to process prediction. Please try again."],
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setDbMessage("❌ Unexpected error while saving or predicting");
      setResult({
        riskLevel: "Error",
        percentage: "N/A",
        recommendations: [
          "Error occurred during prediction",
          "Please check your input data and try again",
          "If the problem persists, contact support",
        ],
      });
    }

    setIsSubmitting(false);
  };

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const bloodGroupOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  const rhStatusOptions = [
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Negative" },
  ];

  const thyroidOptions = [
    { value: "normal", label: "Normal" },
    { value: "hyperthyroid", label: "Hyperthyroid" },
    { value: "hypothyroid", label: "Hypothyroid" },
    { value: "unknown", label: "Unknown/Not tested" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 mb-4">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Molar Pregnancy Risk Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete this comprehensive assessment to evaluate the risk of molar
            pregnancy based on patient demographics, clinical symptoms,
            laboratory data, and ultrasound findings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* All your FormSection + FormInput fields remain unchanged */}
          {/* ... (keep your existing form inputs here) ... */}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isSubmitting ? "Saving & Analyzing..." : "Assess Molar Pregnancy Risk"}
            </button>
          </div>
        </form>

        {/* ✅ Database status message */}
        {dbMessage && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">
            {dbMessage}
          </p>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-green-100 to-blue-100 mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Assessment Complete
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Risk Level
                </h3>
                <div className="text-3xl font-bold text-purple-600">
                  {result.riskLevel}
                </div>
                <div className="text-xl text-gray-600">{result.percentage}</div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-700">
                    <strong>Important:</strong> This assessment is for
                    informational purposes only. Molar pregnancy requires
                    immediate medical attention and specialized treatment.
                    Please consult with a qualified healthcare professional
                    immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MolarPregnancy;
