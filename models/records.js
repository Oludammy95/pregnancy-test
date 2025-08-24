import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  conditionType: {
    type: String,
    enum: ["Molar Pregnancy", "Ectopic Pregnancy"],
    required: true,
  },
  patient: {
    full_name: String,
    age: Number,
    gravida: Number,
    parity: Number,
    abortions: Number,
    contact_info: String,
  },
  clinical_input: {
    history: {
      historyOfMolarPregnancy: String,
      historyOfMiscarriages: String,
      numberOfMiscarriages: Number,
      historyOfEctopicPregnancy: String,
      pelvicInflammatoryDisease: String,
      tubalSurgeryHistory: String,
      infertilityTreatment: String,
    },
    symptoms: {
      vaginalBleeding: String,
      abdominalPain: String,
      pelvicPain: String,
      excessiveNausea: String,
      passageOfVesicles: String,
      uterineSizeLarger: String,
      lastMenstrualPeriodDays: Number,
    },
    risk_factors: {
      smokingAlcohol: String,
      assistedReproduction: String,
      smokingStatus: String,
      contraceptiveUse: String,
    },
    laboratory: {
      quantitativeHCG: Number,
      bloodGroup: String,
      rhStatus: String,
      thyroidFunction: String,
      serumHCGLevel: Number,
      progesteroneLevel: Number,
    },
    ultrasound: {
      gestationalSacPresent: String,
      fetalHeartbeat: String,
      snowstormAppearance: String,
      ovarianCysts: String,
      uterineSizeByUltrasound: String,
      adnexalMass: String,
      freeFluidInPouchOfDouglas: String,
    },
  },
  prediction: {
    label: String,
    confidence: Number,
    model_version: String,
    predicted_at: { type: Date, default: Date.now },
  },
  feedback: {
    confirmed_label: String,
    confirmed_by: String,
    confirmed_at: Date,
  },
  created_at: { type: Date, default: Date.now },
});

// ✅ Prevent recompiling models in dev / hot reload
export default mongoose.models.Record || mongoose.model("Record", recordSchema);
