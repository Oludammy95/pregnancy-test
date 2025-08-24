import mongoose from "mongoose";

const MolarSchema = new mongoose.Schema(
  {
    // Patient Demographics
    age: { type: Number, required: true },
    gravida: { type: Number, required: true },
    parity: { type: Number, required: true },
    historyOfMolarPregnancy: { type: String },
    historyOfMiscarriages: { type: String },
    numberOfMiscarriages: { type: Number },

    // Presenting Symptoms
    vaginalBleeding: { type: String },
    excessiveNausea: { type: String },
    pelvicPain: { type: String },
    passageOfVesicles: { type: String },
    uterineSizeLarger: { type: String },

    // Laboratory Data
    quantitativeHCG: { type: Number },
    bloodGroup: { type: String },
    rhStatus: { type: String },
    thyroidFunction: { type: String },

    // Ultrasound Findings
    gestationalSacPresent: { type: String },
    fetalHeartbeat: { type: String },
    snowstormAppearance: { type: String },
    ovarianCysts: { type: String },

    // Other Risk Factors
    assistedReproduction: { type: String },
    smokingAlcohol: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Molar || mongoose.model("Molar", MolarSchema);
