from models.soil_report import SoilReport
from extensions import db

class SoilService:
    @staticmethod
    def analyze_soil(user_id, data):
        try:
            n = float(data.get('nitrogen', 0))
            p = float(data.get('phosphorus', 0))
            k = float(data.get('potassium', 0))
            ph = float(data.get('ph', 7))
            moisture = float(data.get('moisture', 50))
            
            verdict = "Normal"
            if ph < 6.0: verdict = "Acidic"
            elif ph > 7.5: verdict = "Alkaline"
            if n < 20 or p < 10 or k < 10: verdict += ", Nutrient Deficient"
            
            crops = ["Wheat", "Maize"]
            if ph >= 6.0 and ph <= 7.0: crops.extend(["Rice", "Sugarcane"])
            
            report = SoilReport(
                user_id=user_id,
                nitrogen=n, phosphorus=p, potassium=k, ph=ph, moisture=moisture,
                health_verdict=verdict,
                suitable_crops=",".join(crops)
            )
            db.session.add(report)
            db.session.commit()
            return {'success': True, 'data': report.to_dict(), 'message': 'Soil analyzed successfully'}
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'message': str(e)}
