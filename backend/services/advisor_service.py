from models import User
from services.weather_service import WeatherService
from services.soil_service import SoilService
from services.fertilizer_service import FertilizerService
from extensions import db
import logging

# Standard nutrient/pH/moisture defaults for common Indian soil types
SOIL_TYPE_DEFAULTS = {
    'Red Soil': {'nitrogen': 25, 'phosphorus': 15, 'potassium': 15, 'ph': 6.2, 'moisture': 35},
    'Black Soil': {'nitrogen': 45, 'phosphorus': 22, 'potassium': 25, 'ph': 7.6, 'moisture': 55},
    'Clayey Soil': {'nitrogen': 35, 'phosphorus': 18, 'potassium': 30, 'ph': 6.8, 'moisture': 60},
    'Sandy Soil': {'nitrogen': 15, 'phosphorus': 10, 'potassium': 12, 'ph': 6.0, 'moisture': 25},
    'Alluvial Soil': {'nitrogen': 50, 'phosphorus': 25, 'potassium': 35, 'ph': 7.0, 'moisture': 45},
}

DEFAULT_SOIL = {'nitrogen': 30, 'phosphorus': 18, 'potassium': 20, 'ph': 6.5, 'moisture': 40}

class AdvisorService:
    @staticmethod
    def get_smart_recommendation(user_id):
        try:
            # 1. Retrieve user details
            user = User.query.get(user_id)
            if not user:
                return {'success': False, 'message': 'User not found'}
            
            district = user.district or 'Bangalore'
            land_size = user.land_size or 1.0
            soil_name = user.soil_type or 'Red Soil'
            
            # Get soil parameters mapped from soil name
            soil_params = SOIL_TYPE_DEFAULTS.get(soil_name, DEFAULT_SOIL)
            
            # 2. Get Weather details for user's district
            weather_res = WeatherService.get_weather(district)
            temp = 28.0
            humidity = 60.0
            rainfall = 15.0
            weather_advisory = "Normal conditions"
            
            if weather_res.get('success'):
                current_weather = weather_res['data']['current']
                temp = current_weather.get('temperature', temp)
                humidity = current_weather.get('humidity', humidity)
                rainfall = current_weather.get('rainfall', rainfall)
                weather_advisory = weather_res['data'].get('advisory', weather_advisory)
            
            # 3. Crop Suitability Algorithm
            suitable_crops = []
            ph = soil_params['ph']
            
            # Check crop rules (mapped to the 13 crops in the trained dataset)
            if 5.5 <= ph <= 7.0 and humidity >= 65 and rainfall > 20:
                suitable_crops.append({'name': 'Paddy', 'suitability': 'High Compatibility (Prefers wet & acidic-neutral soil)'})
            if 6.0 <= ph <= 7.5 and temp < 26:
                suitable_crops.append({'name': 'Blackgram', 'suitability': 'High Compatibility (Thrives in dry/winter soil)'})
            if 5.8 <= ph <= 7.2:
                suitable_crops.append({'name': 'Groundnut', 'suitability': 'High Compatibility (Highly adaptable to well-drained soils)'})
            if soil_name == 'Black Soil' and 22 <= temp <= 35:
                suitable_crops.append({'name': 'Cotton', 'suitability': 'High Compatibility (Highly suited for Black cotton soil)'})
            if 6.0 <= ph <= 7.8:
                suitable_crops.append({'name': 'Coconut', 'suitability': 'Moderate Compatibility (Thrives in clay/alluvial soil)'})
                
            # Default fallbacks if list is empty
            if not suitable_crops:
                suitable_crops = [
                    {'name': 'Groundnut', 'suitability': 'High Compatibility (Resilient crop)'},
                    {'name': 'Cotton', 'suitability': 'Moderate Compatibility'}
                ]
                
            # 4. Smart Fertilizer Calculation
            # Determine deficiency based on soil parameters
            rec_fertilizer = "NPK 19-19-19"
            qty_per_acre = 50.0
            reason = "Balanced nutrient booster for general growth stage."
            
            n, p, k = soil_params['nitrogen'], soil_params['phosphorus'], soil_params['potassium']
            if n < 30:
                rec_fertilizer = "Urea"
                qty_per_acre = 40.0
                reason = f"Due to low nitrogen ({n} ppm) in {soil_name}."
            elif p < 18:
                rec_fertilizer = "DAP (Diammonium Phosphate)"
                qty_per_acre = 45.0
                reason = f"Due to low phosphorus ({p} ppm) in {soil_name}."
            elif k < 18:
                rec_fertilizer = "MOP (Muriate of Potash)"
                qty_per_acre = 30.0
                reason = f"Due to low potassium ({k} ppm) in {soil_name}."
            
            # Compute total quantity based on user's land size
            total_qty = round(qty_per_acre * land_size, 1)
            
            # 5. Live Market Intelligence Prediction using Random Forest model
            primary_crop = suitable_crops[0]['name']
            market_data = {}
            from services.price_service import PriceService
            price_res = PriceService.predict_price(district, primary_crop, user_id)
            if price_res.get('success'):
                market_data = price_res['data']
            
            return {
                'success': True,
                'data': {
                    'profile': {
                        'district': district,
                        'land_size': land_size,
                        'soil_type': soil_name,
                        'soil_parameters': soil_params
                    },
                    'weather': {
                        'temperature': temp,
                        'humidity': humidity,
                        'rainfall': rainfall,
                        'advisory': weather_advisory
                    },
                    'crops': suitable_crops,
                    'fertilizer': {
                        'recommended_fertilizer': rec_fertilizer,
                        'quantity_per_acre': qty_per_acre,
                        'total_quantity': total_qty,
                        'reason': reason
                    },
                    'market': market_data
                }
            }
        except Exception as e:
            logging.exception("Error calculating smart advisory")
            return {'success': False, 'message': str(e)}
