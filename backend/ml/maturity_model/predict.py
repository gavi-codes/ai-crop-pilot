import os
import json
from google import genai
from google.genai import types
from PIL import Image
import time

def predict_maturity(image_path):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {
            "success": False,
            "message": "GEMINI_API_KEY is missing in your backend/.env file. Please add it to use the Real AI Engine."
        }
        
    try:
        client = genai.Client()
        image = Image.open(image_path)
        
        response_schema = {
            "type": "OBJECT",
            "properties": {
                "stage": {
                    "type": "STRING",
                    "description": "Must be exactly one of: Unripe, Ripening, Harvest-Ready, or Overripe"
                },
                "confidence": {
                    "type": "INTEGER",
                    "description": "Confidence percentage between 0 and 100"
                },
                "estimated_days": {
                    "type": "STRING",
                    "description": "Estimated time until harvest (e.g. '7-10 Days' or 'Harvest Now')"
                },
                "analysis_json": {
                    "type": "OBJECT",
                    "properties": {
                        "English": {"type": "STRING"},
                        "Kannada": {"type": "STRING"},
                        "Hindi": {"type": "STRING"}
                    },
                    "description": "Detailed visual analysis of color, texture, and size in 3 languages."
                },
                "actionable_advice_json": {
                    "type": "OBJECT",
                    "properties": {
                        "English": {"type": "STRING"},
                        "Kannada": {"type": "STRING"},
                        "Hindi": {"type": "STRING"}
                    },
                    "description": "Farming advice based on the maturity stage in 3 languages."
                }
            },
            "required": ["stage", "confidence", "estimated_days", "analysis_json", "actionable_advice_json"]
        }

        response = None
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model='gemini-3.6-flash',
                    contents=[
                        image, 
                        "You are an expert agricultural botanist and computer vision AI. Identify the specific crop in this image and analyze its maturity stage. Look at color breakdown, firmness, and size. Make sure your analysis and advice explicitly mention the identified crop name. Output strictly in the requested JSON schema."
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
            "success": True,
            "stage": result["stage"],
            "confidence": result["confidence"],
            "estimated_days": result["estimated_days"],
            "analysis_json": json.dumps(result["analysis_json"]),
            "actionable_advice_json": json.dumps(result["actionable_advice_json"])
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Gemini AI Error: {str(e)}"
        }
