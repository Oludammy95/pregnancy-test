"use client";
import { useState } from "react";
import Layout from "../../components/Header";
import FormInput from "../../components/FormInput";
import FormSection from "../../components/FormSection";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const EctopicPregnancy = () => {
  const [formData, setFormData] = useState({
    // Demographics
    age: "",
    gravidity: "",
    parity: "",
    abortions: "",

    // Patient History
    historyOfEctopicPregnancy: "",
    pelvicInflammatoryDisease: "",
    tubalSurgeryHistory: "",
    infertilityTreatment: "",

    // Risk Factors
    smokingStatus: "",
    contraceptiveUse: "",

    // Clinical & Symptoms
    lastMenstrualPeriodDays: "",
    vaginalBleeding: "",
    abdominalPain: "",

    // Laboratory Tests
    serumHCGLevel: "",
    progesteroneLevel: "",

    // Ultrasound Findings
    uterineSizeByUltrasound: "",
    adnexalMass: "",
    freeFluidInPouchOfDouglas: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [dbMessage, setDbMessage] = useState("");

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
      // 1️⃣ Save to MongoDB
      const dbRes = await fetch("/api/ectopic", {
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
      const { predictEctopic } = await import("../../utils/api");
      const response = await predictEctopic(formData);

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
          <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-red-100 to-pink-100 mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ectopic Pregnancy Risk Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete the form below to assess the risk of ectopic pregnancy
            based on patient demographics, clinical symptoms, and diagnostic
            findings.
          </p>
        </div>

        {/* ✅ Full Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <FormSection title="Demographics">
            <FormInput
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
            />
            <FormInput
              label="Gravidity"
              name="gravidity"
              type="number"
              value={formData.gravidity}
              onChange={handleInputChange}
            />
            <FormInput
              label="Parity"
              name="parity"
              type="number"
              value={formData.parity}
              onChange={handleInputChange}
            />
            <FormInput
              label="Abortions"
              name="abortions"
              type="number"
              value={formData.abortions}
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection title="Patient History">
            <FormInput
              label="History of Ectopic Pregnancy"
              name="historyOfEctopicPregnancy"
              type="select"
              options={yesNoOptions}
              value={formData.historyOfEctopicPregnancy}
              onChange={handleInputChange}
            />
            <FormInput
              label="Pelvic Inflammatory Disease"
              name="pelvicInflammatoryDisease"
              type="select"
              options={yesNoOptions}
              value={formData.pelvicInflammatoryDisease}
              onChange={handleInputChange}
            />
            <FormInput
              label="Tubal Surgery History"
              name="tubalSurgeryHistory"
              type="select"
              options={yesNoOptions}
              value={formData.tubalSurgeryHistory}
              onChange={handleInputChange}
            />
            <FormInput
              label="Infertility Treatment"
              name="infertilityTreatment"
              type="select"
              options={yesNoOptions}
              value={formData.infertilityTreatment}
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection title="Risk Factors">
            <FormInput
              label="Smoking Status"
              name="smokingStatus"
              type="select"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              value={formData.smokingStatus}
              onChange={handleInputChange}
            />
            <FormInput
              label="Contraceptive Use"
              name="contraceptiveUse"
              type="text"
              value={formData.contraceptiveUse}
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection title="Clinical & Symptoms">
            <FormInput
              label="Last Menstrual Period (Days)"
              name="lastMenstrualPeriodDays"
              type="number"
              value={formData.lastMenstrualPeriodDays}
              onChange={handleInputChange}
            />
            <FormInput
              label="Vaginal Bleeding"
              name="vaginalBleeding"
              type="select"
              options={yesNoOptions}
              value={formData.vaginalBleeding}
              onChange={handleInputChange}
            />
            <FormInput
              label="Abdominal Pain"
              name="abdominalPain"
              type="select"
              options={yesNoOptions}
              value={formData.abdominalPain}
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection title="Laboratory Tests">
            <FormInput
              label="Serum hCG Level"
              name="serumHCGLevel"
              type="number"
              value={formData.serumHCGLevel}
              onChange={handleInputChange}
            />
            <FormInput
              label="Progesterone Level"
              name="progesteroneLevel"
              type="number"
              value={formData.progesteroneLevel}
              onChange={handleInputChange}
            />
          </FormSection>

          <FormSection title="Ultrasound Findings">
            <FormInput
              label="Uterine Size"
              name="uterineSizeByUltrasound"
              type="text"
              value={formData.uterineSizeByUltrasound}
              onChange={handleInputChange}
            />
            <FormInput
              label="Adnexal Mass"
              name="adnexalMass"
              type="select"
              options={yesNoOptions}
              value={formData.adnexalMass}
              onChange={handleInputChange}
            />
            <FormInput
              label="Free Fluid in Pouch of Douglas"
              name="freeFluidInPouchOfDouglas"
              type="select"
              options={yesNoOptions}
              value={formData.freeFluidInPouchOfDouglas}
              onChange={handleInputChange}
            />
          </FormSection>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isSubmitting
                ? "Saving & Analyzing..."
                : "Assess Ectopic Pregnancy Risk"}
            </button>
          </div>
        </form>

        {/* Database status */}
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
              <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Risk Level
                </h3>
                <div className="text-3xl font-bold text-red-600">
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EctopicPregnancy;
