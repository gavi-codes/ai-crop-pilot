import os
import json
from google import genai
from google.genai import types
from PIL import Image
import time

def predict_disease(image_path):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY is missing in your backend/.env file.")
        
    try:
        client = genai.Client()
        image = Image.open(image_path)
        
        response_schema = {
            "type": "OBJECT",
            "properties": {
                "disease_name": {
                    "type": "STRING",
                    "description": "Name of the crop and the disease detected. E.g., 'Tomato Early Blight' or 'Healthy Cotton'"
                },
                "confidence": {
                    "type": "INTEGER",
                    "description": "Confidence percentage between 0 and 100"
                },
                "prevention": {
                    "type": "STRING",
                    "description": "Short English prevention summary"
                },
                "description_json": {
                    "type": "OBJECT",
                    "properties": {
                        "English": {"type": "STRING"},
                        "Kannada": {"type": "STRING"},
                        "Hindi": {"type": "STRING"}
                    }
                },
                "treatment_json": {
                    "type": "OBJECT",
                    "properties": {
                        "English": {"type": "STRING"},
                        "Kannada": {"type": "STRING"},
                        "Hindi": {"type": "STRING"}
                    }
                },
                "recovery_fertilizer_json": {
                    "type": "OBJECT",
                    "properties": {
                        "English": {"type": "STRING"},
                        "Kannada": {"type": "STRING"},
                        "Hindi": {"type": "STRING"}
                    }
                },
                "medicine": {
                    "type": "OBJECT",
                    "description": "Details of the recommended chemical medicine or pesticide.",
                    "properties": {
                        "name": {"type": "STRING", "description": "Exact commercial name of the medicine (e.g., 'Bavistin', 'Mancozeb 75% WP')"},
                        "price_estimate": {"type": "STRING", "description": "Estimated price in INR, e.g., '₹ 450 per 500g'"},
                        "quantity": {"type": "STRING", "description": "Dosage to apply (e.g., '2 grams per liter of water')"},
                        "photo_url": {"type": "STRING", "description": "URL of the medicine photo. Use 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&q=80' as a generic pesticide bottle image."}
                    },
                    "required": ["name", "price_estimate", "quantity", "photo_url"]
                }
            },
            "required": ["disease_name", "confidence", "prevention", "description_json", "treatment_json", "recovery_fertilizer_json", "medicine"]
        }

        response = None
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model='gemini-3.6-flash',
                    contents=[
                        image, 
                        "You are an expert agricultural botanist. Identify the crop and the disease from this image. If healthy, state 'Healthy [Crop Name]'. Provide treatment, recovery fertilizer, and specific chemical medicine recommendations with price and quantity."
                    ],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=response_schema,
                        temperature=0.2,
                    ),
                )
                break
            except Exception as e:
                if '503' in str(e) and attempt < 2:
                    time.sleep(2)
                    continue
                raise e
        
        result = json.loads(response.text)
        
        return {
            "disease_name": result["disease_name"],
            "confidence": result["confidence"],
            "description_json": json.dumps(result["description_json"]),
            "treatment_json": json.dumps(result["treatment_json"]),
            "recovery_fertilizer_json": json.dumps(result["recovery_fertilizer_json"]),
            "prevention": result["prevention"],
            "medicine": json.dumps(result["medicine"])
        }
        
    except Exception as e:
        raise Exception(f"Gemini AI Error: {str(e)}")
