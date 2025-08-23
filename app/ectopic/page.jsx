"use client";
import { useState } from "react";
import Layout from "../../components/Header";
import FormInput from "../../components/FormInput";
import FormSection from "../../components/FormSection";
import {
  UserIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
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

    try {
      // Import the API function dynamically
      const { predictEctopic } = await import("../../utils/api");

      // Call the actual API
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
      console.error("Prediction error:", error);
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Demographics */}
          <FormSection title="Patient Demographics" icon={UserIcon}>
            <FormInput
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Enter age in years"
              required
            />
            <FormInput
              label="Gravidity (No. of pregnancies)"
              name="gravidity"
              type="number"
              value={formData.gravidity}
              onChange={handleInputChange}
              placeholder="Total number of pregnancies"
              required
            />
            <FormInput
              label="Parity (No. of births)"
              name="parity"
              type="number"
              value={formData.parity}
              onChange={handleInputChange}
              placeholder="Number of live births"
              required
            />
            <FormInput
              label="Abortion(s)/Miscarriage(s)"
              name="abortions"
              type="number"
              value={formData.abortions}
              onChange={handleInputChange}
              placeholder="Number of abortions"
              required
            />
          </FormSection>

          {/* Patient History */}
          <FormSection title="Patient History" icon={ClockIcon}>
            <FormInput
              label="History of Ectopic Pregnancy"
              name="historyOfEctopicPregnancy"
              type="radio"
               value={formData.historyOfEctopicPregnancy}
              onChange={handleInputChange}
              options={yesNoOptions}
              required
            />
            <FormInput
              label="History of Pelvic Inflammatory Disease"
              name="pelvicInflammatoryDisease"
              type="radio"
              value={formData.pelvicInflammatoryDisease}
              onChange={handleInputChange}
              options={yesNoOptions}
              required
            />
            <FormInput
              label="History of Tubal Surgery"
              name="tubalSurgeryHistory"
              type="radio"
              value={formData.tubalSurgeryHistory}
              onChange={handleInputChange}
              options={yesNoOptions}
              required
            />
            <FormInput
              label="Infertility Treatment"
              name="infertilityTreatment"
              type="radio"
              value={formData.infertilityTreatment}
              onChange={handleInputChange}
              options={yesNoOptions}
              required
            />
          </FormSection>

          {/* Risk Factors / Lifestyle */}
          <FormSection
            title="Risk Factors / Lifestyle"
            icon={ExclamationTriangleIcon}
          >
            <FormInput
              label="Smoking Status"
              name="smokingStatus"
              type="radio"
              value={formData.smokingStatus}
              onChange={handleInputChange}
              options={yesNoOptions}
               required
            />
            <FormInput
              label="Contraceptive Use"
              name="contraceptiveUse"
              type="radio"
              value={formData.contraceptiveUse}
              onChange={handleInputChange}
              options={yesNoOptions}
              required
            />
          </FormSection>

          {/* Clinical & Symptom Information */}
          <FormSection
            title="Clinical & Symptom Information"
            icon={ChartBarIcon}
          >
            <FormInput
              label="Days Since Last Menstrual Period"
              name="lastMenstrualPeriodDays"
              type="number"
              value={formData.lastMenstrualPeriodDays}
              onChange={handleInputChange}
              placeholder="Enter number of days"
              required
            />
            <FormInput
              label="Vaginal Bleeding"
              name="vaginalBleeding"
              type="radio"
              value={formData.vaginalBleeding}
              onChange={handleInputChange}
              options={yesNoOptions}
              required
            />
            <FormInput
              label="Abdominal Pain"
              name="abdominalPain"
              type="radio"
              value={formData.abdominalPain}
              onChange={handleInputChange}
              options={yesNoOptions}
              required
            />
          </FormSection>

          {/* Laboratory Tests */}
          <FormSection title="Laboratory Tests" icon={BeakerIcon}>
            <FormInput
              label="Serum hCG Level (mIU/mL)"
              name="serumHCGLevel"
              type="number"
              value={formData.serumHCGLevel}
              onChange={handleInputChange}
              placeholder="Enter hCG level"
            />
            <FormInput
              label="Progesterone Level (ng/mL)"
              name="progesteroneLevel"
              type="number"
              step="0.01"
              value={formData.progesteroneLevel}
              onChange={handleInputChange}
              placeholder="Enter progesterone level"
            />
          </FormSection>

          {/* Ultrasound Findings */}
          <FormSection title="Ultrasound Findings" icon={MagnifyingGlassIcon}>
            <FormInput
              label="Uterine Size by Ultrasound (mm or cm)"
              name="uterineSizeByUltrasound"
              type="number"
              value={formData.uterineSizeByUltrasound}
              onChange={handleInputChange}
              placeholder="Enter measurement"
            />
            <FormInput
              label="Adnexal Mass Present"
              name="adnexalMass"
              type="radio"
              value={formData.adnexalMass}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <FormInput
              label="Free Fluid in Pouch of Douglas"
              name="freeFluidInPouchOfDouglas"
              type="radio"
              value={formData.freeFluidInPouchOfDouglas}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
          </FormSection>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                "Assess Ectopic Pregnancy Risk"
              )}
            </button>
          </div>
        </form>

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

            <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-700">
                    <strong>Important:</strong> This assessment is for
                    informational purposes only. Please consult with a qualified
                    healthcare professional for proper diagnosis and treatment.
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

export default EctopicPregnancy;
