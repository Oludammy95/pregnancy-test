"use client";
import { useState } from "react";
import Layout from "../../components/Header";
import FormInput from "../../components/FormInput";
import FormSection from "../../components/FormSection";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const MolarPregnancy = () => {
  const [formData, setFormData] = useState({
    age: "",
    gravidity: "",
    parity: "",
    abortions: "",
    uterineSize: "",
    vaginalBleeding: "",
    hyperemesis: "",
    preeclampsia: "",
    hyperthyroidism: "",
    serumHCGLevel: "",
    ultrasoundFindings: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [dbMessage, setDbMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Validation function (mirror backend)
  const validateForm = () => {
    const validationErrors = [];
    const age = parseInt(formData.age, 10);
    const gravidity = parseInt(formData.gravidity, 10);
    const parity = parseInt(formData.parity, 10);
    const abortions = parseInt(formData.abortions, 10);

    if (isNaN(age) || age < 15 || age > 49) {
      validationErrors.push("Age must be between 15 and 49 years.");
    }
    if (gravidity < 0 || parity < 0 || abortions < 0) {
      validationErrors.push("Gravidity, parity, and abortions must be non-negative.");
    }
    if (parity > gravidity) {
      validationErrors.push("Parity cannot exceed gravidity.");
    }
    if (abortions > gravidity) {
      validationErrors.push("Abortions cannot exceed gravidity.");
    }
    if (parity + abortions > gravidity) {
      validationErrors.push("Parity + abortions cannot exceed gravidity.");
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDbMessage("");
    setErrors([]);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // 1️⃣ Save to MongoDB
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

      // 2️⃣ Prediction
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
        ],
      });
    }

    setIsSubmitting(false);
  };

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Molar Pregnancy Risk Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete the form below to assess the risk of molar pregnancy
            based on patient demographics, clinical symptoms, labs, and
            ultrasound findings.
          </p>
        </div>

        {/* ❌ Validation errors */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-400 text-red-700 p-4 rounded">
            <ul className="list-disc list-inside">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Demographics */}
          <FormSection title="Demographics">
            <FormInput label="Age" name="age" type="number" value={formData.age} onChange={handleInputChange} />
            <FormInput label="Gravidity" name="gravidity" type="number" value={formData.gravidity} onChange={handleInputChange} />
            <FormInput label="Parity" name="parity" type="number" value={formData.parity} onChange={handleInputChange} />
            <FormInput label="Abortions" name="abortions" type="number" value={formData.abortions} onChange={handleInputChange} />
          </FormSection>

          {/* Clinical Symptoms */}
          <FormSection title="Clinical Symptoms">
            <FormInput label="Uterine Size" name="uterineSize" type="text" value={formData.uterineSize} onChange={handleInputChange} />
            <FormInput label="Vaginal Bleeding" name="vaginalBleeding" type="select" options={yesNoOptions} value={formData.vaginalBleeding} onChange={handleInputChange} />
            <FormInput label="Hyperemesis" name="hyperemesis" type="select" options={yesNoOptions} value={formData.hyperemesis} onChange={handleInputChange} />
            <FormInput label="Preeclampsia" name="preeclampsia" type="select" options={yesNoOptions} value={formData.preeclampsia} onChange={handleInputChange} />
            <FormInput label="Hyperthyroidism" name="hyperthyroidism" type="select" options={yesNoOptions} value={formData.hyperthyroidism} onChange={handleInputChange} />
          </FormSection>

          {/* Labs & Imaging */}
          <FormSection title="Laboratory & Imaging">
            <FormInput label="Serum hCG Level" name="serumHCGLevel" type="number" value={formData.serumHCGLevel} onChange={handleInputChange} />
            <FormInput label="Ultrasound Findings" name="ultrasoundFindings" type="text" value={formData.ultrasoundFindings} onChange={handleInputChange} />
          </FormSection>

          {/* Submit */}
          <div className="text-center">
            <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 transition-all duration-300">
              {isSubmitting ? "Saving & Analyzing..." : "Assess Molar Pregnancy Risk"}
            </button>
          </div>
        </form>

        {/* DB status */}
        {dbMessage && <p className="mt-4 text-center text-sm font-medium text-gray-700">{dbMessage}</p>}

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-green-100 to-blue-100 mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Level</h3>
                <div className="text-3xl font-bold text-yellow-600">{result.riskLevel}</div>
                <div className="text-xl text-gray-600">{result.percentage}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MolarPregnancy;
