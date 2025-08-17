import sys
import json
import joblib 
import numpy as np
import pandas as pd
import os
from pathlib import Path

class EctopicPregnancyPredictor:
    def __init__(self, model_path):
        self.model_path = model_path
        self.model = None
        self.feature_names = [
            'PatientID', 'Age', 'Gravidity', 'Parity', 'Abortions',
            'EctopicPregnancyHistory', 'PelvicInflammatoryDisease', 
            'TubalSurgeryHistory', 'InfertilityTreatment', 'SmokingStatus',
            'ContraceptiveUse', 'LastMenstrualPeriodDays', 'VaginalBleeding',
            'AbdominalPain', 'SerumHCGLevel', 'ProgesteroneLevel',
            'UterineSizeByUltrasound', 'AdnexalMass', 'FreeFluidInPouchOfDouglas'
        ]
        self.load_model()
    
    def load_model(self):
        try:
            # Try joblib first (recommended for sklearn models)
            self.model = joblib.load(self.model_path)
            print("Ectopic pregnancy model loaded successfully with joblib", file=sys.stderr)
            
            # Get feature names from the loaded model if available
            if hasattr(self.model, 'feature_names_in_'):
                self.feature_names = list(self.model.feature_names_in_)
                print(f"Using feature names from model: {self.feature_names}", file=sys.stderr)
            else:
                print("Model doesn't have feature_names_in_, using predefined names", file=sys.stderr)
                
        except Exception as e:
            try:
                # Fallback to pickle
                import pickle
                with open(self.model_path, 'rb') as file:
                    self.model = pickle.load(file)
                print("Ectopic pregnancy model loaded successfully with pickle", file=sys.stderr)
                
                # Get feature names from the loaded model if available
                if hasattr(self.model, 'feature_names_in_'):
                    self.feature_names = list(self.model.feature_names_in_)
                    print(f"Using feature names from model: {self.feature_names}", file=sys.stderr)
                else:
                    print("Model doesn't have feature_names_in_, using predefined names", file=sys.stderr)
                    
            except Exception as e2:
                print(f"Error loading ectopic model with both joblib and pickle: {e}, {e2}", file=sys.stderr)
                self.model = None
    
    def preprocess_data(self, form_data):
        try:
            # Create a case-insensitive lookup dictionary
            normalized_lookup = {k.lower(): k for k in form_data.keys()}
            
            # Define default values for different field types
            field_defaults = {
                'PatientID': 0,
                'Age': 25,  # Default to typical reproductive age
                'Gravidity': 0,
                'Parity': 0,
                'Abortions': 0,
                'LastMenstrualPeriodDays': 28,  # Default to typical cycle
                'SerumHCGLevel': 0,
                'ProgesteroneLevel': 0,
                'UterineSizeByUltrasound': 0,
                # Boolean fields default to 0 (no/false)
                'EctopicPregnancyHistory': 0,
                'PelvicInflammatoryDisease': 0,
                'SmokingStatus': 0,
                'ContraceptiveUse': 0,
                'InfertilityTreatment': 0,
                'AdnexalMass': 0,
                'FreeFluidInPouchOfDouglas': 0,
                'VaginalBleeding': 0,
                'AbdominalPain': 0,
                'TubalSurgeryHistory': 0
            }
            
            features = {}
            missing_fields = []
            
            # Process each feature that the model expects
            for feature_name in self.feature_names:
                # Try to find the field in input data (case-insensitive)
                search_key = feature_name.lower()
                original_key = normalized_lookup.get(search_key)
                
                if original_key:
                    # Field exists in input
                    value = form_data.get(original_key)
                    
                    # Handle different field types
                    if feature_name in ['PatientID', 'Age', 'Gravidity', 'Parity', 'Abortions', 
                                      'LastMenstrualPeriodDays', 'SerumHCGLevel', 'ProgesteroneLevel', 
                                      'UterineSizeByUltrasound']:
                        # Numeric fields
                        try:
                            features[feature_name] = float(value) if value != '' and value is not None else field_defaults[feature_name]
                        except (ValueError, TypeError):
                            features[feature_name] = field_defaults[feature_name]
                            print(f"Warning: Invalid numeric value for {feature_name}, using default", file=sys.stderr)
                    else:
                        # Boolean fields (yes/no)
                        if isinstance(value, str):
                            features[feature_name] = 1 if value.lower() in ['yes', 'true', '1'] else 0
                        elif isinstance(value, bool):
                            features[feature_name] = 1 if value else 0
                        elif isinstance(value, (int, float)):
                            features[feature_name] = 1 if value > 0 else 0
                        else:
                            features[feature_name] = field_defaults[feature_name]
                else:
                    # Field missing from input, use default
                    features[feature_name] = field_defaults[feature_name]
                    missing_fields.append(feature_name)
            
            if missing_fields:
                print(f"Info: Using defaults for missing fields: {missing_fields}", file=sys.stderr)
            
            # Create DataFrame with proper feature names in correct order
            df = pd.DataFrame([features], columns=self.feature_names)
            return df
        
        except Exception as e:
            print(f"Error preprocessing ectopic data: {e}", file=sys.stderr)
            return None
    
    def predict(self, form_data):
        if self.model is None:
            return {"error": "Model not loaded"}
        
        try:
            features_df = self.preprocess_data(form_data)
            if features_df is None:
                return {"error": "Invalid input data"}
            
            prediction = self.model.predict(features_df)
            prediction_proba = self.model.predict_proba(features_df)
            
            return self.interpret_results(prediction_proba)
        
        except Exception as e:
            print(f"Error in prediction: {e}", file=sys.stderr)
            return {"error": str(e)}
    
    def interpret_results(self, prediction_proba):
        risk_probability = prediction_proba[0][1]  # Probability of ectopic pregnancy
        
        if risk_probability >= 0.7:
            risk_level = "High"
            recommendations = [
                "Immediate gynecological consultation required",
                "Emergency department evaluation recommended", 
                "Serial hCG monitoring every 12-24 hours",
                "Urgent transvaginal ultrasound examination",
                "Consider diagnostic laparoscopy if clinically indicated",
                "Patient requires immediate medical attention"
            ]
        elif risk_probability >= 0.4:
            risk_level = "Moderate"
            recommendations = [
                "Gynecological consultation within 24-48 hours",
                "Serial hCG monitoring every 48 hours",
                "Transvaginal ultrasound examination",
                "Close clinical monitoring required",
                "Patient education on warning signs",
                "Follow-up appointment scheduled"
            ]
        else:
            risk_level = "Low"
            recommendations = [
                "Routine obstetric follow-up appropriate",
                "Standard prenatal care monitoring",
                "Patient education on pregnancy symptoms",
                "Follow-up as clinically indicated",
                "Monitor for any concerning symptoms"
            ]
        
        return {
            "riskLevel": risk_level,
            "percentage": f"{risk_probability * 100:.1f}%",
            "probability": float(risk_probability),
            "recommendations": recommendations
        }

class MolarPregnancyPredictor:
    def __init__(self, model_path):
        self.model_path = model_path
        self.model = None
        self.feature_names = [
            'PatientID', 'age', 'age_group_<20', 'age_group_20-35', 'age_group_>35',
            'gravida', 'parity', 'historyOfMolarPregnancy', 'historyOfMiscarriages',
            'numberOfMiscarriages', 'vaginalBleeding', 'excessiveNausea', 'pelvicPain',
            'passageOfVesicles', 'uterineSizeLarger', 'quantitativeHCG',
            'bloodGroup_A+', 'bloodGroup_A-', 'bloodGroup_B+', 'bloodGroup_B-',
            'bloodGroup_AB+', 'bloodGroup_AB-', 'bloodGroup_O+', 'bloodGroup_O-',
            'rhStatus', 'thyroidFunction_normal', 'thyroidFunction_hyperthyroid',
            'thyroidFunction_hypothyroid', 'thyroidFunction_unknown',
            'gestationalSacPresent', 'fetalHeartbeat', 'snowstormAppearance',
            'ovarianCysts', 'assistedReproduction', 'smokingAlcohol'
        ]
        self.load_model()
    
    def load_model(self):
        try:
            # Try joblib first (recommended for sklearn models)
            self.model = joblib.load(self.model_path)
            print("Molar pregnancy model loaded successfully with joblib", file=sys.stderr)
            
            # Get feature names from the loaded model if available
            if hasattr(self.model, 'feature_names_in_'):
                self.feature_names = list(self.model.feature_names_in_)
                print(f"Using feature names from model: {self.feature_names}", file=sys.stderr)
            else:
                print("Model doesn't have feature_names_in_, using predefined names", file=sys.stderr)
                
        except Exception as e:
            try:
                # Fallback to pickle
                import pickle
                with open(self.model_path, 'rb') as file:
                    self.model = pickle.load(file)
                print("Molar pregnancy model loaded successfully with pickle", file=sys.stderr)
                
                # Get feature names from the loaded model if available
                if hasattr(self.model, 'feature_names_in_'):
                    self.feature_names = list(self.model.feature_names_in_)
                    print(f"Using feature names from model: {self.feature_names}", file=sys.stderr)
                else:
                    print("Model doesn't have feature_names_in_, using predefined names", file=sys.stderr)
                    
            except Exception as e2:
                print(f"Error loading molar model with both joblib and pickle: {e}, {e2}", file=sys.stderr)
                self.model = None
    
    def preprocess_data(self, form_data):
        try:
            # Convert keys to lowercase for case-insensitive matching
            normalized_data = {k.lower(): v for k, v in form_data.items()}
            
            features = {}

            # Patient ID
            features['PatientID'] = float(normalized_data.get("patientid", 0))
            
            # Patient Demographics
            age = float(normalized_data.get('age', 0))
            features['age'] = age
            
            # Age group encoding
            age_group = normalized_data.get('agegroup', '')
            features['age_group_<20'] = 1 if age_group == '<20' else 0
            features['age_group_20-35'] = 1 if age_group == '20-35' else 0
            features['age_group_>35'] = 1 if age_group == '>35' else 0
            
            features['gravida'] = float(normalized_data.get('gravida', 0))
            features['parity'] = float(normalized_data.get('parity', 0))
            features['historyOfMolarPregnancy'] = 1 if normalized_data.get('historyofmolarpregnancy', '').lower() == 'yes' else 0
            features['historyOfMiscarriages'] = 1 if normalized_data.get('historyofmiscarriages', '').lower() == 'yes' else 0
            features['numberOfMiscarriages'] = float(normalized_data.get('numberofmiscarriages', 0))
            
            # Presenting Symptoms
            features['vaginalBleeding'] = 1 if normalized_data.get('vaginalbleeding', '').lower() == 'yes' else 0
            features['excessiveNausea'] = 1 if normalized_data.get('excessivenausea', '').lower() == 'yes' else 0
            features['pelvicPain'] = 1 if normalized_data.get('pelvicpain', '').lower() == 'yes' else 0
            features['passageOfVesicles'] = 1 if normalized_data.get('passageofvesicles', '').lower() == 'yes' else 0
            features['uterineSizeLarger'] = 1 if normalized_data.get('uterinesizelarger', '').lower() == 'yes' else 0
            
            # Laboratory Data
            features['quantitativeHCG'] = float(normalized_data.get('quantitativehcg', 0))
            
            # Blood group encoding (one-hot)
            blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
            blood_group = normalized_data.get('bloodgroup', '')
            for bg in blood_groups:
                features[f'bloodGroup_{bg}'] = 1 if blood_group == bg else 0
            
            features['rhStatus'] = 1 if normalized_data.get('rhstatus', '').lower() == 'positive' else 0
            
            # Thyroid function encoding
            thyroid_conditions = ['normal', 'hyperthyroid', 'hypothyroid', 'unknown']
            thyroid = normalized_data.get('thyroidfunction', '')
            for condition in thyroid_conditions:
                features[f'thyroidFunction_{condition}'] = 1 if thyroid == condition else 0
            
            # Ultrasound Findings
            features['gestationalSacPresent'] = 1 if normalized_data.get('gestationalsacpresent', '').lower() == 'yes' else 0
            features['fetalHeartbeat'] = 1 if normalized_data.get('fetalheartbeat', '').lower() == 'yes' else 0
            features['snowstormAppearance'] = 1 if normalized_data.get('snowstormappearance', '').lower() == 'yes' else 0
            features['ovarianCysts'] = 1 if normalized_data.get('ovariancysts', '').lower() == 'yes' else 0
            
            # Other Risk Factors
            features['assistedReproduction'] = 1 if normalized_data.get('assistedreproduction', '').lower() == 'yes' else 0
            features['smokingAlcohol'] = 1 if normalized_data.get('smokingalcohol', '').lower() == 'yes' else 0
            
            # Create DataFrame with proper feature names
            df = pd.DataFrame([features], columns=self.feature_names)
            return df
        
        except Exception as e:
            print(f"Error preprocessing molar data: {e}", file=sys.stderr)
            return None
    
    def predict(self, form_data):
        if self.model is None:
            return {"error": "Model not loaded"}
        
        try:
            features_df = self.preprocess_data(form_data)
            if features_df is None:
                return {"error": "Invalid input data"}
            
            prediction = self.model.predict(features_df)
            prediction_proba = self.model.predict_proba(features_df)
            
            return self.interpret_results(prediction_proba)
        
        except Exception as e:
            print(f"Error in prediction: {e}", file=sys.stderr)
            return {"error": str(e)}
    
    def interpret_results(self, prediction_proba):
        risk_probability = prediction_proba[0][1]  # Probability of molar pregnancy
        
        if risk_probability >= 0.7:
            risk_level = "High"
            recommendations = [
                "URGENT: Immediate obstetric consultation required",
                "Emergency referral to gynecologic oncology",
                "Serial hCG monitoring every 24-48 hours",
                "Comprehensive ultrasound examination",
                "Prepare for possible evacuation procedure",
                "Patient requires immediate specialized care",
                "Baseline chest X-ray and laboratory workup"
            ]
        elif risk_probability >= 0.4:
            risk_level = "Moderate"
            recommendations = [
                "Obstetric consultation within 24 hours",
                "Serial hCG monitoring every 48-72 hours",
                "Detailed ultrasound examination required",
                "Consider tissue sampling if indicated",
                "Close follow-up until hCG normalizes",
                "Patient education on warning signs",
                "Monitor for complications"
            ]
        else:
            risk_level = "Low"
            recommendations = [
                "Routine obstetric follow-up appropriate",
                "Standard prenatal monitoring",
                "Follow-up hCG as clinically indicated",
                "Patient education on pregnancy symptoms",
                "Monitor for any concerning changes"
            ]
        
        return {
            "riskLevel": risk_level,
            "percentage": f"{risk_probability * 100:.1f}%",
            "probability": float(risk_probability),
            "recommendations": recommendations
        }

def main():
    try:
        # Read command line arguments
        model_type = sys.argv[1]  # 'ectopic' or 'molar'
        input_data = json.loads(sys.argv[2])  # JSON string of form data
        
        # Get the project root directory
        project_root = Path(__file__).parent.parent
        models_dir = project_root / "models"
        
        if model_type == "ectopic":
            model_path = models_dir / "ectopic_pregnancy_model.pkl"
            predictor = EctopicPregnancyPredictor(model_path)
        elif model_type == "molar":
            model_path = models_dir / "molar_pregnancy_model.pkl"
            predictor = MolarPregnancyPredictor(model_path)
        else:
            print(json.dumps({"error": "Invalid model type"}))
            return
        
        # Make prediction
        result = predictor.predict(input_data)
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()