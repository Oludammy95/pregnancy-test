import mongoose from "mongoose";

const EctopicSchema = new mongoose.Schema(
  {
    // Demographics
    age: { type: Number, required: true },
    gravidity: { type: Number, required: true },
    parity: { type: Number, required: true },
    abortions: { type: Number },

    // Patient History
    historyOfEctopicPregnancy: { type: String },
    pelvicInflammatoryDisease: { type: String },
    tubalSurgeryHistory: { type: String },
    infertilityTreatment: { type: String },

    // Risk Factors
    smokingStatus: { type: String },
    contraceptiveUse: { type: String },

    // Clinical & Symptoms
    lastMenstrualPeriodDays: { type: Number },
    vaginalBleeding: { type: String },
    abdominalPain: { type: String },

    // Laboratory Tests
    serumHCGLevel: { type: Number },
    progesteroneLevel: { type: Number },

    // Ultrasound Findings
    uterineSizeByUltrasound: { type: String },
    adnexalMass: { type: String },
    freeFluidInPouchOfDouglas: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Ectopic || mongoose.model("Ectopic", EctopicSchema);
