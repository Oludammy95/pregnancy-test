import mongoose from "mongoose";

const EctopicSchema = new mongoose.Schema(
  {
    // Demographics
    age: { type: Number, required: true, min: 15, max: 49 },
    gravidity: { type: Number, required: true, min: 0 },
    parity: { type: Number, required: true, min: 0 },
    abortions: { type: Number, min: 0, default: 0 },

    // Patient History
    historyOfEctopicPregnancy: { type: String, enum: ["Yes", "No"], default: "No" },
    pelvicInflammatoryDisease: { type: String, enum: ["Yes", "No", "Unknown"], default: "Unknown" },
    tubalSurgeryHistory: { type: String, enum: ["Yes", "No", "Unknown"], default: "Unknown" },
    infertilityTreatment: { type: String, enum: ["Yes", "No", "Unknown"], default: "Unknown" },

    // Risk Factors
    smokingStatus: { type: String, enum: ["Yes", "No", "Unknown"], default: "Unknown" },
    contraceptiveUse: { type: String, enum: ["Yes", "No", "Unknown"], default: "Unknown" },

    // Clinical & Symptoms
    lastMenstrualPeriodDays: { type: Number, min: 0 },
    vaginalBleeding: { type: String, enum: ["Yes", "No", "Unknown"], default: "Unknown" },
    abdominalPain: { type: String, enum: ["Yes", "No", "Unknown"], default: "Unknown" },

    // Laboratory Tests
    serumHCGLevel: { type: Number, min: 0 },
    progesteroneLevel: { type: Number, min: 0 },

    // Ultrasound Findings
    uterineSizeByUltrasound: { type: String },
    adnexalMass: { type: String, enum: ["Yes", "No", "Unknown"], default: "Unknown" },
    freeFluidInPouchOfDouglas: { type: String, enum: ["Yes", "No", "Unknown"], default: "Unknown" },
  },
  { timestamps: true, collection: "ectopic_cases" } // 👈 use consistent collection name
);

export default mongoose.models.Ectopic ||
  mongoose.model("Ectopic", EctopicSchema);
