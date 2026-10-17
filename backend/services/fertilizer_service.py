from models.fertilizer_recommendation import FertilizerRecommendation
from extensions import db
import logging

logger = logging.getLogger(__name__)

# Scientifically calibrated dosage matrix (Formulation, Quantity kg/ac, Reason/Instructions)
FERTILIZER_RULES = {
    'paddy': {
        'seedling': ('DAP (Diammonium Phosphate)', 40.0, 'Stimulates deep root germination and early nursery vigor.'),
        'vegetative': ('Urea + Zinc Sulphate', 45.0, 'Promotes rapid stem elongation and high tiller production.'),
        'flowering': ('MOP (Muriate of Potash)', 30.0, 'Enhances panicle emergence and ensures fertile spikelet formation.'),
        'fruiting': ('Potassium Nitrate (13-0-45)', 20.0, 'Maximizes grain weight, starch filling, and prevents lodging.'),
    },
    'cotton': {
        'seedling': ('DAP 18-46-0', 45.0, 'Strengthens taproot formation in black cotton soils.'),
        'vegetative': ('Urea + Magnesium Sulphate', 50.0, 'Supplies essential nitrogen and prevents leaf reddening.'),
        'flowering': ('MOP + Soluble Boron 20%', 35.0, 'Critical for square retention and flower drop prevention.'),
        'fruiting': ('NPK 19-19-19 + 0-0-50', 30.0, 'Directs nutrients into boll enlargement and lint quality.'),
    },
    'sugarcane': {
        'seedling': ('NPK 10-26-26 Complex', 75.0, 'Basal dose applied during sett planting for deep ratoon roots.'),
        'vegetative': ('Urea (Split Application)', 90.0, 'Accelerates thick cane stalk elongation and internode growth.'),
        'flowering': ('MOP (Muriate of Potash)', 50.0, 'Prevents pithiness and drought stress during maturity.'),
        'fruiting': ('MOP + Micronutrient Mixture', 40.0, 'Boosts brix percentage and sucrose sugar accumulation.'),
    },
    'maize': {
        'seedling': ('DAP (Diammonium Phosphate)', 45.0, 'Promotes vigorous crown root establishment.'),
        'vegetative': ('Urea + Zinc Sulphate', 55.0, 'Applied at knee-high stage for lush leaf canopy.'),
        'flowering': ('NPK 19-19-19 + Urea', 40.0, 'Provides balanced nutrition for tassel and silk development.'),
        'fruiting': ('MOP (Potash)', 30.0, 'Enhances cob kernel size and uniform grain filling.'),
    },
    'groundnut': {
        'seedling': ('Single Super Phosphate (SSP) + Gypsum', 60.0, 'Supplies sulfur and phosphorus without excess nitrogen.'),
        'vegetative': ('NPK 10-26-26', 35.0, 'Maintains balanced vegetative canopy without vine runaway.'),
        'flowering': ('Agricultural Gypsum', 80.0, 'Crucial calcium source for subterranean peg penetration.'),
        'fruiting': ('MOP (Potash) + Borax', 25.0, 'Ensures dual-kernel pod filling and prevents blind nuts.'),
    },
    'tomato': {
        'seedling': ('DAP + Trichoderma Viride', 35.0, 'Transplant root establishment and fungal shield.'),
        'vegetative': ('Calcium Nitrate + Urea', 30.0, 'Builds strong foliage and cell wall thickness.'),
        'flowering': ('NPK 12-61-0 (MAP) + Boron', 25.0, 'Maximizes flower retention and blossom set.'),
        'fruiting': ('Potassium Nitrate (13-0-45)', 35.0, 'Enhances fruit firmness, deep red color, and prevents blossom-end rot.'),
    },
    'wheat': {
        'seedling': ('DAP 18-46-0', 50.0, 'Crown root initiation (CRI) primary booster.'),
        'vegetative': ('Urea + Zinc', 45.0, 'Stimulates active tillering and chlorophyll density.'),
        'flowering': ('NPK 19-19-19', 35.0, 'Booting stage application for elongated wheat ears.'),
        'fruiting': ('MOP (Potash)', 25.0, 'Grain milk stage defense against terminal heat stress.'),
    }
}

class FertilizerService:
    @staticmethod
    def recommend(user_id, data):
        try:
            crop_raw = str(data.get('crop', '')).strip().lower()
            growth_stage_raw = str(data.get('growth_stage', 'Vegetative')).strip().lower()
            soil_report_id = data.get('soil_report_id')

            # Match crop
            matched_key = None
            for key in FERTILIZER_RULES:
                if key in crop_raw or (key == 'paddy' and ('rice' in crop_raw or 'dhan' in crop_raw)):
                    matched_key = key
                    break

            # Match growth stage
            matched_stage = 'vegetative'
            if 'seed' in growth_stage_raw:
                matched_stage = 'seedling'
            elif 'flower' in growth_stage_raw or 'bloom' in growth_stage_raw:
                matched_stage = 'flowering'
            elif 'fruit' in growth_stage_raw or 'grain' in growth_stage_raw or 'mature' in growth_stage_raw:
                matched_stage = 'fruiting'

            # Look up rule
            if matched_key and matched_stage in FERTILIZER_RULES[matched_key]:
                rec_fert, qty, note = FERTILIZER_RULES[matched_key][matched_stage]
            else:
                rec_fert = "NPK 19-19-19 Balanced Complex"
                qty = 45.0
                note = "Balanced multi-nutrient formulation for sustained crop vigor."

            # Save to database if possible
            rec_dict = {
                'id': 1,
                'user_id': user_id,
                'crop': data.get('crop', 'Field Crop'),
                'soil_report_id': soil_report_id,
                'growth_stage': data.get('growth_stage', 'Vegetative'),
                'recommended_fertilizer': rec_fert,
                'quantity_per_acre': qty,
                'notes': note
            }

            try:
                recommendation = FertilizerRecommendation(
                    user_id=user_id,
                    crop=data.get('crop', 'Field Crop'),
                    soil_report_id=soil_report_id,
                    growth_stage=data.get('growth_stage', 'Vegetative'),
                    recommended_fertilizer=rec_fert,
                    quantity_per_acre=qty
                )
                db.session.add(recommendation)
                db.session.commit()
                rec_dict = recommendation.to_dict()
                rec_dict['notes'] = note
            except Exception as dbe:
                logger.warning(f"Notice: Database write bypassed for fertilizer: {dbe}")
                db.session.rollback()

            return {
                'success': True,
                'data': rec_dict,
                'message': 'Fertilizer recommended successfully'
            }
        except Exception as e:
            return {'success': False, 'message': str(e)}
