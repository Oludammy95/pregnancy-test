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
    ageGroup: "",
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
      console.error("Prediction error:", error);
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

  // Options
  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];
  const ageGroupOptions = [
    { value: "<20", label: "Less than 20 years" },
    { value: "20-35", label: "20-35 years" },
    { value: ">35", label: "More than 35 years" },
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
            Complete this assessment to evaluate the risk of molar pregnancy
            based on patient demographics, clinical symptoms, laboratory data,
            and ultrasound findings.
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
              required
            />
            <FormInput
              label="Age Group"
              name="ageGroup"
              type="select"
              value={formData.ageGroup}
              onChange={handleInputChange}
              options={ageGroupOptions}
              required
            />
            <FormInput
              label="Gravida"
              name="gravida"
              type="number"
              value={formData.gravida}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Parity"
              name="parity"
              type="number"
              value={formData.parity}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="History of Molar Pregnancy"
              name="historyOfMolarPregnancy"
              type="radio"
              value={formData.historyOfMolarPregnancy}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <FormInput
              label="History of Miscarriages"
              name="historyOfMiscarriages"
              type="radio"
              value={formData.historyOfMiscarriages}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            {formData.historyOfMiscarriages === "yes" && (
              <FormInput
                label="Number of Miscarriages"
                name="numberOfMiscarriages"
                type="number"
                value={formData.numberOfMiscarriages}
                onChange={handleInputChange}
              />
            )}
          </FormSection>

          {/* Symptoms */}
          <FormSection title="Presenting Symptoms" icon={HeartIcon}>
            <FormInput
              label="Vaginal Bleeding"
              name="vaginalBleeding"
              type="radio"
              value={formData.vaginalBleeding}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <FormInput
              label="Excessive Nausea"
              name="excessiveNausea"
              type="radio"
              value={formData.excessiveNausea}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <FormInput
              label="Pelvic Pain"
              name="pelvicPain"
              type="radio"
              value={formData.pelvicPain}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <FormInput
              label="Passage of Vesicles"
              name="passageOfVesicles"
              type="radio"
              value={formData.passageOfVesicles}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <FormInput
              label="Uterine Size Larger"
              name="uterineSizeLarger"
              type="radio"
              value={formData.uterineSizeLarger}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
          </FormSection>

          {/* Labs */}
          <FormSection title="Laboratory Data" icon={BeakerIcon}>
            <FormInput
              label="Quantitative hCG"
              name="quantitativeHCG"
              type="number"
              value={formData.quantitativeHCG}
              onChange={handleInputChange}
            />
            <FormInput
              label="Blood Group"
              name="bloodGroup"
              type="select"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              options={bloodGroupOptions}
            />
            <FormInput
              label="Rh Status"
              name="rhStatus"
              type="select"
              value={formData.rhStatus}
              onChange={handleInputChange}
              options={rhStatusOptions}
            />
            <FormInput
              label="Thyroid Function"
              name="thyroidFunction"
              type="select"
              value={formData.thyroidFunction}
              onChange={handleInputChange}
              options={thyroidOptions}
            />
          </FormSection>

          {/* Ultrasound */}
          <FormSection title="Ultrasound Findings" icon={MagnifyingGlassIcon}>
            <FormInput
              label="Gestational Sac Present"
              name="gestationalSacPresent"
              type="radio"
              value={formData.gestationalSacPresent}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <FormInput
              label="Fetal Heartbeat"
              name="fetalHeartbeat"
              type="radio"
              value={formData.fetalHeartbeat}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <FormInput
              label="Snowstorm Appearance"
              name="snowstormAppearance"
              type="radio"
              value={formData.snowstormAppearance}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <FormInput
              label="Ovarian Cysts"
              name="ovarianCysts"
              type="radio"
              value={formData.ovarianCysts}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
          </FormSection>

          {/* Risk Factors */}
          <FormSection title="Other Risk Factors" icon={ShieldExclamationIcon}>
            <FormInput
              label="Assisted Reproduction"
              name="assistedReproduction"
              type="radio"
              value={formData.assistedReproduction}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <FormInput
              label="Smoking/Alcohol"
              name="smokingAlcohol"
              type="radio"
              value={formData.smokingAlcohol}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
          </FormSection>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-300"
            >
              {isSubmitting ? "Analyzing..." : "Assess Molar Pregnancy Risk"}
            </button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Assessment Complete
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">Risk Level</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {result.riskLevel}
                </p>
                <p className="text-gray-600">{result.percentage}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Recommendations</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {result.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
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
