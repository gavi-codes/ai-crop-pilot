import os
import json
from google import genai
from google.genai import types
from PIL import Image

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
                }
            },
            "required": ["disease_name", "confidence", "prevention", "description_json", "treatment_json", "recovery_fertilizer_json"]
        }

        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=[
                image, 
                "You are an expert agricultural botanist. Identify the crop and the disease from this image. If healthy, state 'Healthy [Crop Name]'. Provide treatment and recovery fertilizer recommendations."
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_schema,
                temperature=0.2,
            ),
        )
        
        result = json.loads(response.text)
        
        return {
            "disease_name": result["disease_name"],
            "confidence": result["confidence"],
            "description_json": json.dumps(result["description_json"]),
            "treatment_json": json.dumps(result["treatment_json"]),
            "recovery_fertilizer_json": json.dumps(result["recovery_fertilizer_json"]),
            "prevention": result["prevention"]
        }
        
    except Exception as e:
        raise Exception(f"Gemini AI Error: {str(e)}")
