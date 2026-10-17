from models.soil_report import SoilReport
from extensions import db
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class SoilService:
    @staticmethod
    def analyze_soil(user_id, data):
        try:
            n = float(data.get('nitrogen', 25))
            p = float(data.get('phosphorus', 15))
            k = float(data.get('potassium', 15))
            ph = float(data.get('ph', 6.5))
            moisture = float(data.get('moisture', 40))
            
            # Precise agronomic health diagnosis
            verdict_parts = []
            if ph < 5.8:
                verdict_parts.append(f"Strongly Acidic (pH {ph}) — recommend agricultural lime (calcium carbonate) application.")
            elif ph <= 6.5:
                verdict_parts.append(f"Slightly Acidic to Neutral (pH {ph}) — optimal range for major food & pulse crops.")
            elif ph <= 7.5:
                verdict_parts.append(f"Neutral to Moderately Alkaline (pH {ph}) — ideal nutrient assimilation profile.")
            else:
                verdict_parts.append(f"Alkaline Soil (pH {ph}) — recommend gypsum and organic compost.")

            nutrient_status = []
            if n < 25: nutrient_status.append("Low Nitrogen")
            elif n > 50: nutrient_status.append("High Nitrogen")
            else: nutrient_status.append("Optimal Nitrogen")

            if p < 15: nutrient_status.append("Low Phosphorus")
            elif p > 30: nutrient_status.append("High Phosphorus")
            else: nutrient_status.append("Optimal Phosphorus")

            if k < 15: nutrient_status.append("Low Potassium")
            elif k > 35: nutrient_status.append("High Potassium")
            else: nutrient_status.append("Optimal Potassium")

            verdict = f"{verdict_parts[0]} {' • '.join(nutrient_status)}."

            # Crop matching logic
            crops = []
            if 5.5 <= ph <= 7.2 and moisture >= 35:
                crops.append("Paddy (Rice)")
            if 5.8 <= ph <= 7.5:
                crops.append("Groundnut")
            if 6.0 <= ph <= 8.0 and n >= 25:
                crops.append("Cotton")
            if 5.8 <= ph <= 7.2 and n >= 30:
                crops.append("Maize")
            if 6.0 <= ph <= 7.5:
                crops.append("Blackgram")
            if 6.0 <= ph <= 7.8 and moisture >= 40:
                crops.append("Sugarcane")
            if 5.5 <= ph <= 7.0:
                crops.append("Tomato")

            if not crops:
                crops = ["Groundnut", "Cotton", "Maize"]

            report_dict = {
                'id': 1,
                'user_id': user_id,
                'nitrogen': n,
                'phosphorus': p,
                'potassium': k,
                'ph': ph,
                'moisture': moisture,
                'health_verdict': verdict,
                'suitable_crops': crops,
                'created_at': datetime.utcnow().isoformat()
            }

            try:
                report = SoilReport(
                    user_id=user_id,
                    nitrogen=n, phosphorus=p, potassium=k, ph=ph, moisture=moisture,
                    health_verdict=verdict,
                    suitable_crops=",".join(crops)
                )
                db.session.add(report)
                db.session.commit()
                report_dict = report.to_dict()
            except Exception as dbe:
                logger.warning(f"Notice: Database write bypassed for soil report: {dbe}")
                db.session.rollback()

            return {
                'success': True,
                'data': report_dict,
                'message': 'Soil analyzed successfully'
            }
        except Exception as e:
            return {'success': False, 'message': str(e)}
