from models.fertilizer_recommendation import FertilizerRecommendation
from extensions import db

class FertilizerService:
    @staticmethod
    def recommend(user_id, data):
        try:
            crop = data.get('crop', 'Unknown')
            growth_stage = data.get('growth_stage', 'Vegetative')
            soil_report_id = data.get('soil_report_id')
            
            # Simple rule-engine lookup
            rec_fert = "NPK 19-19-19"
            qty = 50.0
            
            if crop.lower() == "rice" and growth_stage.lower() == "flowering":
                rec_fert = "Urea"
                qty = 30.0
            elif crop.lower() == "wheat":
                rec_fert = "DAP"
                qty = 40.0
                
            recommendation = FertilizerRecommendation(
                user_id=user_id,
                crop=crop,
                soil_report_id=soil_report_id,
                growth_stage=growth_stage,
                recommended_fertilizer=rec_fert,
                quantity_per_acre=qty
            )
            db.session.add(recommendation)
            db.session.commit()
            return {'success': True, 'data': recommendation.to_dict(), 'message': 'Fertilizer recommended successfully'}
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'message': str(e)}
