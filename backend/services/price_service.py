import os
import joblib
import pandas as pd
from datetime import datetime, timedelta
import random
from models import User
from models.weather import WeatherLog
from extensions import db

# Supported categorical features in the trained RF pipeline
DATASET_LOCATIONS = ['Mangalore', 'Kodagu', 'Kasaragodu', 'Raichur', 'Gulbarga', 'Madikeri', 'Hassan', 'Mysuru', 'Chikmangaluru', 'Bangalore', 'Davangere']
DATASET_SOILS = ['Alluvial', 'Red', 'Black', 'Loam', 'Sandy loam', 'Red laterite', 'Black cotton', 'Sandy', 'Laterite', 'Teelah', 'Clay', 'Clay loam', 'Arid and Desert', 'loamy sand', 'River basins', 'Light sandy', 'Heavy clay', 'Dry sandy', 'Heavy cotton', 'Sandy loam', 'Sandy clay loam', 'Well drained', 'Drained loam', 'Red', 'Gravelly sand', 'Medium textured clay', 'Medium textured']
DATASET_CROPS = ['Coconut', 'Cocoa', 'Coffee', 'Cardamum', 'Pepper', 'Arecanut', 'Ginger', 'Tea', 'Paddy', 'Cashew', 'Groundnut', 'Blackgram', 'Cotton']

class PriceService:
    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            model_path = os.path.join(os.path.dirname(__file__), '..', 'ml', 'price_model', 'improved_crop_price_model.pkl')
            if os.path.exists(model_path):
                cls._model = joblib.load(model_path)
            else:
                raise FileNotFoundError(f"Trained RandomForest model not found at: {model_path}")
        return cls._model

    @staticmethod
    def map_location(district):
        d_lower = district.lower().strip()
        # Direct case-insensitive match
        for loc in DATASET_LOCATIONS:
            if loc.lower() == d_lower:
                return loc
        
        # Region-based logical mappings for other Karnataka districts
        mappings = {
            'koppal': 'Raichur',
            'bellary': 'Raichur',
            'gadag': 'Davangere',
            'dharwad': 'Davangere',
            'belagavi': 'Davangere',
            'kolar': 'Bangalore',
            'chikkaballapur': 'Bangalore',
            'mandya': 'Mysuru',
            'chamarajanagar': 'Mysuru',
            'dakshina kannada': 'Mangalore',
            'udupi': 'Mangalore',
            'uttara kannada': 'Mangalore',
            'shimoga': 'Chikmangaluru',
        }
        return mappings.get(d_lower, 'Bangalore')

    @staticmethod
    def map_soil(soil_type):
        if not soil_type:
            return 'Red'
        s_lower = soil_type.lower().strip()
        if 'red' in s_lower:
            return 'Red'
        if 'black' in s_lower:
            return 'Black'
        if 'clay' in s_lower:
            return 'Clay'
        if 'sandy' in s_lower:
            return 'Sandy'
        if 'alluvial' in s_lower:
            return 'Alluvial'
        if 'loam' in s_lower:
            return 'Loam'
        return 'Red'

    @staticmethod
    def get_season(month_num):
        # 1-indexed month number
        if 3 <= month_num <= 6:
            return 'Zaid'
        elif 7 <= month_num <= 10:
            return 'Kharif'
        else:
            return 'Rabi'

    @classmethod
    def predict_single_price(cls, year, location, area, rainfall, temperature, soil_type, irrigation, yields, humidity, crop, season):
        model = cls.get_model()
        
        # Build features DataFrame with exact columns expected by the preprocessor pipeline
        df_in = pd.DataFrame([[
            year, location, area, rainfall, temperature, soil_type, irrigation, yields, humidity, crop, season
        ]], columns=['Year', 'Location', 'Area', 'Rainfall', 'Temperature', 'Soil type', 'Irrigation', 'yeilds', 'Humidity', 'Crops', 'Season'])
        
        pred = model.predict(df_in)
        # RF model yields price, we round to 2 decimals
        return round(float(pred[0]), 2)

    @classmethod
    def predict_price(cls, district, crop_name, user_id=None):
        try:
            # 1. Fetch user data for personalized features
            land_size = 1.0
            user_soil = 'Red Soil'
            
            if user_id:
                user = User.query.get(user_id)
                if user:
                    if user.land_size:
                        land_size = user.land_size
                    if user.soil_type:
                        user_soil = user.soil_type

            # Map user categories to dataset categories
            mapped_location = cls.map_location(district)
            mapped_soil = cls.map_soil(user_soil)
            
            # Map crop case-insensitively
            mapped_crop = 'Cotton'
            crop_lower = crop_name.lower().strip()
            for c in DATASET_CROPS:
                if c.lower() == crop_lower:
                    mapped_crop = c
                    break

            # 2. Get Weather parameters for the district
            today_weather = WeatherLog.query.filter_by(district=district).order_by(WeatherLog.date.desc()).first()
            if today_weather:
                base_temp = today_weather.temperature
                base_humidity = today_weather.humidity
                base_rainfall = today_weather.rainfall
            else:
                # Sensible Karnataka standard averages
                base_temp = 28.0
                base_humidity = 65.0
                base_rainfall = 15.0

            # 3. Predict current price
            now = datetime.now()
            current_season = cls.get_season(now.month)
            
            current_price = cls.predict_single_price(
                year=now.year,
                location=mapped_location,
                area=land_size,
                rainfall=base_rainfall,
                temperature=base_temp,
                soil_type=mapped_soil,
                irrigation='Drip',
                yields=1.5,
                humidity=base_humidity,
                crop=mapped_crop,
                season=current_season
            )

            # 4. Generate historical data using model predictions (varying monthly parameters)
            historical = []
            for i in range(5, -1, -1): # Past 6 months
                hist_date = now - timedelta(days=30*i)
                hist_season = cls.get_season(hist_date.month)
                
                # Vary temperature & rainfall slightly based on month for realistic trend
                month_offset_temp = random.uniform(-3, 3)
                month_offset_rain = random.uniform(-10, 10)
                
                price = cls.predict_single_price(
                    year=hist_date.year,
                    location=mapped_location,
                    area=land_size,
                    rainfall=max(0, base_rainfall + month_offset_rain),
                    temperature=base_temp + month_offset_temp,
                    soil_type=mapped_soil,
                    irrigation='Drip',
                    yields=1.5,
                    humidity=base_humidity + random.uniform(-5, 5),
                    crop=mapped_crop,
                    season=hist_season
                )
                historical.append({
                    'month': hist_date.strftime("%B %Y"),
                    'price': price
                })

            # 5. Generate forecasts using model predictions (future parameters)
            forecast = []
            for i in range(1, 4): # Next 3 months
                f_date = now + timedelta(days=30*i)
                f_season = cls.get_season(f_date.month)
                
                price = cls.predict_single_price(
                    year=f_date.year,
                    location=mapped_location,
                    area=land_size,
                    rainfall=max(0, base_rainfall + random.uniform(-5, 5)),
                    temperature=base_temp + random.uniform(-2, 2),
                    soil_type=mapped_soil,
                    irrigation='Drip',
                    yields=1.5,
                    humidity=base_humidity + random.uniform(-3, 3),
                    crop=mapped_crop,
                    season=f_season
                )
                forecast.append({
                    'month': f_date.strftime("%B %Y"),
                    'price': price
                })

            # 6. Generate Mandi Comparison & Recommendations (Module 3)
            # Simulated distance mapping from district to dataset locations
            DISTANCES_FROM_DISTRICT = {
                'koppal': {
                    'Raichur': 120, 'Davangere': 150, 'Gulbarga': 220, 'Chikmangaluru': 260,
                    'Hassan': 300, 'Bangalore': 340, 'Mysuru': 380, 'Kodagu': 390,
                    'Madikeri': 400, 'Mangalore': 420, 'Kasaragodu': 450
                },
                'bangalore': {
                    'Bangalore': 10, 'Hassan': 180, 'Mysuru': 140, 'Davangere': 260,
                    'Chikmangaluru': 240, 'Kodagu': 250, 'Madikeri': 260, 'Mangalore': 350,
                    'Kasaragodu': 370, 'Raichur': 410, 'Gulbarga': 580
                },
                'mysore': {
                    'Mysuru': 15, 'Bangalore': 140, 'Hassan': 120, 'Kodagu': 100,
                    'Madikeri': 120, 'Chikmangaluru': 180, 'Mangalore': 250, 'Kasaragodu': 280,
                    'Davangere': 280, 'Raichur': 520, 'Gulbarga': 650
                }
            }
            
            dist_map = DISTANCES_FROM_DISTRICT.get(district.lower().strip(), {})
            
            mandis_list = []
            for loc in DATASET_LOCATIONS:
                # Predict price for this specific mandi
                mandi_price = cls.predict_single_price(
                    year=now.year,
                    location=loc,
                    area=land_size,
                    rainfall=base_rainfall,
                    temperature=base_temp,
                    soil_type=mapped_soil,
                    irrigation='Drip',
                    yields=1.5,
                    humidity=base_humidity,
                    crop=mapped_crop,
                    season=current_season
                )
                
                # Fetch or generate distance
                distance = dist_map.get(loc, random.randint(80, 420))
                
                # Transport Cost = ₹0.20 per quintal per km
                transport_cost = round(distance * 0.20, 2)
                net_profitability = round(mandi_price - transport_cost, 2)
                
                mandis_list.append({
                    'location': loc,
                    'price': mandi_price,
                    'distance': distance,
                    'transport_cost': transport_cost,
                    'net_profitability': net_profitability
                })
            
            # Sort mandis by net profitability descending
            mandis_list.sort(key=lambda m: m['net_profitability'], reverse=True)
            best_mandi = mandis_list[0]

            return {
                'success': True,
                'data': {
                    'crop': mapped_crop,
                    'district': district,
                    'current_price': current_price,
                    'historical': historical,
                    'forecast': forecast,
                    'mandis': mandis_list,
                    'best_mandi': best_mandi
                }
            }
        except Exception as e:
            import logging
            logging.exception("Error predicting price using Random Forest")
            return {'success': False, 'message': f"Prediction error: {str(e)}"}
