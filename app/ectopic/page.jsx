"use client";

import { useState } from "react";

export default function EctopicForm() {
  const [formData, setFormData] = useState({
    age: "",
    gravidity: "",
    parity: "",
    abortions: "",
    historyOfEctopicPregnancy: "No",
    pelvicInflammatoryDisease: "No",
    tubalSurgeryHistory: "No",
    infertilityTreatment: "No",
    smokingStatus: "No",
    contraceptiveUse: "No",
    lastMenstrualPeriodDays: "",
    vaginalBleeding: "No",
    abdominalPain: "No",
    serumHCGLevel: "",
    progesteroneLevel: "",
    uterineSizeByUltrasound: "Normal",
    adnexalMass: "No",
    freeFluidInPouchOfDouglas: "No",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setResult({ error: data.error, details: data.details });
      }
    } catch (err) {
      setResult({ error: "Network error", details: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold">Ectopic Pregnancy Risk Form</h2>

      {/* Demographics */}
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        name="gravidity"
        placeholder="Gravidity"
        value={formData.gravidity}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        name="parity"
        placeholder="Parity"
        value={formData.parity}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        name="abortions"
        placeholder="Abortions"
        value={formData.abortions}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* Dropdown Yes/No fields */}
      {[
        "historyOfEctopicPregnancy",
        "pelvicInflammatoryDisease",
        "tubalSurgeryHistory",
        "infertilityTreatment",
        "smokingStatus",
        "contraceptiveUse",
        "vaginalBleeding",
        "abdominalPain",
        "adnexalMass",
        "freeFluidInPouchOfDouglas",
      ].map((field) => (
        <select
          key={field}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      ))}

      {/* Labs */}
      <input
        type="number"
        name="serumHCGLevel"
        placeholder="Serum hCG Level"
        value={formData.serumHCGLevel}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        name="progesteroneLevel"
        placeholder="Progesterone Level"
        value={formData.progesteroneLevel}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* Ultrasound findings */}
      <select
        name="uterineSizeByUltrasound"
        value={formData.uterineSizeByUltrasound}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="Normal">Normal</option>
        <option value="Enlarged">Enlarged</option>
        <option value="Small">Small</option>
      </select>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit"}
      </button>

      {/* Results */}
      {result && (
        <div className="p-3 mt-3 border rounded bg-gray-50">
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}
