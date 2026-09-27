import os
import re

with open('backend/services/price_service.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace global imports
content = content.replace('import joblib', '')
content = content.replace('import pandas as pd', '')

# Insert the mock logic in get_model
new_get_model = '''    @classmethod
    def get_model(cls):
        if os.environ.get('VERCEL') == '1':
            class MockModel:
                def predict(self, df):
                    return [6000.0]
            return MockModel()
            
        if cls._model is None:
            import joblib
            model_path = os.path.join(os.path.dirname(__file__), '..', 'ml', 'price_model', 'improved_crop_price_model.pkl')
            if os.path.exists(model_path):
                cls._model = joblib.load(model_path)
            else:
                raise FileNotFoundError(f"Trained RandomForest model not found at: {model_path}")
        return cls._model'''

content = re.sub(r'    @classmethod\s+def get_model\(cls\):.*?return cls\._model', new_get_model, content, flags=re.DOTALL)

# Insert the pandas import in predict_single_price
new_predict_single = '''    @classmethod
    def predict_single_price(cls, year, location, area, rainfall, temperature, soil_type, irrigation, yields, humidity, crop, season):
        model = cls.get_model()
        
        if os.environ.get('VERCEL') == '1':
            # Fast mock for serverless
            import random
            return round(random.uniform(5000, 7500), 2)
            
        import pandas as pd
        df_in = pd.DataFrame([[
            year, location, area, rainfall, temperature, soil_type, irrigation, yields, humidity, crop, season
        ]], columns=['Year', 'Location', 'Area', 'Rainfall', 'Temperature', 'Soil type', 'Irrigation', 'yeilds', 'Humidity', 'Crops', 'Season'])
        
        pred = model.predict(df_in)
        return round(float(pred[0]), 2)'''

content = re.sub(r'    @classmethod\s+def predict_single_price\(cls.*?(?=\s+@classmethod\s+def predict_price)', new_predict_single + '\n\n', content, flags=re.DOTALL)

with open('backend/services/price_service.py', 'w', encoding='utf-8') as f:
    f.write(content)
