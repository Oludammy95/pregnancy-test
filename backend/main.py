from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import joblib
import os

# ---------- CONFIG ----------
# Load model paths from env vars (fall back to local files)
ECTOPIC_MODEL_PATH = os.getenv("ECTOPIC_MODEL_PATH", "models/ectopic_pregnancy_model.pkl")
MOLAR_MODEL_PATH = os.getenv("MOLAR_MODEL_PATH", "models/molar_pregnancy_model.pkl")

# ---------- APP ----------
app = FastAPI(title="Pregnancy Risk Expert System API")

# Allow frontend origins (update with your deployed URL later)
origins = [
    "http://localhost:3000",
    "https://https://pregnancy-test.netlify.app/",  # replace with your actual frontend URL
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- SCHEMAS ----------

# Ectopic pregnancy input schema
class EctopicPayload(BaseModel):
    age: float
    gravidity: float
    parity: float
    abortions: float
    historyOfEctopicPregnancy: int = Field(..., ge=0, le=1)
    pelvicInflammatoryDisease: int = Field(..., ge=0, le=1)
    tubalSurgeryHistory: int = Field(..., ge=0, le=1)
    infertilityTreatment: int = Field(..., ge=0, le=1)
    smokingStatus: int = Field(..., ge=0, le=1)
    contraceptiveUse: int = Field(..., ge=0, le=1)
    lastMenstrualPeriodDays: float
    vaginalBleeding: int = Field(..., ge=0, le=1)
    abdominalPain: int = Field(..., ge=0, le=1)
    serumHCGLevel: float
    progesteroneLevel: float
    uterineSizeByUltrasound: float
    adnexalMass: int = Field(..., ge=0, le=1)
    freeFluidInPouchOfDouglas: int = Field(..., ge=0, le=1)

# Molar pregnancy input schema
class MolarPayload(BaseModel):
    age: float
    gravida: float
    parity: float
    historyOfMolarPregnancy: int = Field(..., ge=0, le=1)
    historyOfMiscarriages: int = Field(..., ge=0, le=1)
    numberOfMiscarriages: float
    vaginalBleeding: int = Field(..., ge=0, le=1)
    excessiveNausea: int = Field(..., ge=0, le=1)
    pelvicPain: int = Field(..., ge=0, le=1)
    passageOfVesicles: int = Field(..., ge=0, le=1)
    uterineSizeLarger: int = Field(..., ge=0, le=1)
    quantitativeHCG: float
    bloodGroup: float
    rhStatus: int = Field(..., ge=0, le=1)
    thyroidFunction: float
    gestationalSacPresent: int = Field(..., ge=0, le=1)
    fetalHeartbeat: int = Field(..., ge=0, le=1)
    snowstormAppearance: int = Field(..., ge=0, le=1)
    ovarianCysts: int = Field(..., ge=0, le=1)
    assistedReproduction: int = Field(..., ge=0, le=1)
    smokingAlcohol: int = Field(..., ge=0, le=1)

# Generic response
class PredictResponse(BaseModel):
    prediction: int
    proba: float | None = None

# ---------- STARTUP ----------
@app.on_event("startup")
def load_models():
    global ectopic_model, molar_model
    try:
        ectopic_model = joblib.load(ECTOPIC_MODEL_PATH)
        print(f"Ectopic model loaded from: {ECTOPIC_MODEL_PATH}")
    except Exception as e:
        raise RuntimeError(f"Failed to load ectopic model: {e}")

    try:
        molar_model = joblib.load(MOLAR_MODEL_PATH)
        print(f"Molar model loaded from: {MOLAR_MODEL_PATH}")
    except Exception as e:
        raise RuntimeError(f"Failed to load molar model: {e}")

# ---------- ROUTES ----------
@app.get("/")
def health():
    return {"message": "Pregnancy Risk Expert System API is running"}

@app.post("/predict/ectopic", response_model=PredictResponse)
def predict_ectopic(payload: EctopicPayload):
    try:
        x = np.array([[v for v in payload.dict().values()]])
        y_pred = ectopic_model.predict(x)[0]
        proba = None
        if hasattr(ectopic_model, "predict_proba"):
            proba = float(ectopic_model.predict_proba(x)[0, int(y_pred)])
        return {"prediction": int(y_pred), "proba": proba}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/molar", response_model=PredictResponse)
def predict_molar(payload: MolarPayload):
    try:
        x = np.array([[v for v in payload.dict().values()]])
        y_pred = molar_model.predict(x)[0]
        proba = None
        if hasattr(molar_model, "predict_proba"):
            proba = float(molar_model.predict_proba(x)[0, int(y_pred)])
        return {"prediction": int(y_pred), "proba": proba}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
