from models import User
from models.weather import WeatherLog
from services.price_service import PriceService
from services.weather_service import WeatherService
from services.advisor_service import AdvisorService
import random

DATASET_CROPS_LOWER = ['coconut', 'cocoa', 'coffee', 'cardamum', 'pepper', 'arecanut', 'ginger', 'tea', 'paddy', 'cashew', 'groundnut', 'blackgram', 'cotton']

class ChatbotService:

    @staticmethod
    def get_bot_response(user_id, message):
        user = User.query.get(user_id)
        farmer_name = user.name if user else "Farmer"
        district = user.district if (user and user.district) else "Koppal"
        soil_type = user.soil_type if (user and user.soil_type) else "Black Soil"
        land_size = user.land_size if (user and user.land_size) else 1.0

        msg_lower = message.lower().strip()

        # Identify language of request (simple keyword check)
        lang = 'English'
        kannada_keywords = ['ಬೆಲೆ', 'ದರ', 'ಹವಾಮಾನ', 'ಮಳೆ', 'ರೋಗ', 'ಮಣ್ಣು', 'ಗೊಬ್ಬರ', 'ಯೂರಿಯಾ', 'ನಮಸ್ಕಾರ', 'ಕನ್ನಡ']
        hindi_keywords = ['नमस्ते', 'मौसम', 'बारिश', 'मूल्य', 'दाम', 'बीमारी', 'खाद', 'मिट्टी', 'बताओ']
        
        if any(kw in msg_lower for kw in kannada_keywords):
            lang = 'Kannada'
        elif any(kw in msg_lower for kw in hindi_keywords):
            lang = 'Hindi'

        # 1. Price queries
        price_keywords = ['price', 'cost', 'rate', 'mandi', 'market', 'ಬೆಲೆ', 'ದರ', 'ಭಾವ', 'मूल्य', 'दाम', 'रेट']
        if any(kw in msg_lower for kw in price_keywords):
            matched_crop = None
            for c in DATASET_CROPS_LOWER:
                if c in msg_lower or (c == 'paddy' and 'rice' in msg_lower) or (c == 'paddy' and 'ಭತ್ತ' in msg_lower) or (c == 'cotton' and 'ಹತ್ತಿ' in msg_lower):
                    matched_crop = c
                    break

            if not matched_crop:
                if lang == 'Kannada':
                    return "ದಯವಿಟ್ಟು ಯಾವ ಬೆಳೆಯ ಬೆಲೆ ತಿಳಿಯಬೇಕು ಎಂದು ಬರೆಯಿರಿ (ಉದಾ: ಹತ್ತಿ, ಭತ್ತ, ತೆಂಗಿನಕಾಯಿ)."
                elif lang == 'Hindi':
                    return "कृपया फसल का नाम बताएं जिसकी कीमत आप जानना चाहते हैं (जैसे: कपास, धान, नारियल)."
                else:
                    return "Please specify the crop name to predict price (e.g., Cotton, Paddy, Coconut, Coffee)."

            # Predict price using Random Forest model
            price_res = PriceService.predict_price(district, matched_crop, user_id)
            if price_res.get('success'):
                p_data = price_res['data']
                crop_name_cap = matched_crop.capitalize()
                curr_price = p_data['current_price']
                next_price = p_data['forecast'][0]['price']
                is_bullish = next_price > curr_price
                
                if lang == 'Kannada':
                    sentiment = "ಹೆಚ್ಚಾಗುವ ಸಾಧ್ಯತೆ ಇದೆ (Hold ಮಾಡಿ)" if is_bullish else "ಕಡಿಮೆಯಾಗುವ ಸಾಧ್ಯತೆ ಇದೆ (ಈಗಲೇ ಮಾರಿ)"
                    return f"{district} ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ {crop_name_cap} ಪ್ರಸ್ತುತ ಅಂದಾಜು ಬೆಲೆ ₹{curr_price} / ಕ್ವಿಂಟಾಲ್ ಆಗಿದೆ. ಮುಂದಿನ ತಿಂಗಳು ಬೆಲೆಯು ₹{next_price} ತಲುಪಬಹುದು. ಮಾರುಕಟ್ಟೆ ಸಲಹೆ: {sentiment}."
                elif lang == 'Hindi':
                    sentiment = "बढ़ने की संभावना है (Hold करें)" if is_bullish else "कम होने की संभावना है (अभी बेचें)"
                    return f"{district} मंडी में {crop_name_cap} की वर्तमान अनुमानित कीमत ₹{curr_price} / क्विंटल है। अगले महीने यह ₹{next_price} तक पहुंच सकती है। बाजार सुझाव: {sentiment}."
                else:
                    sentiment = "BULLISH (Hold Crop)" if is_bullish else "BEARISH (Sell Now)"
                    return f"The predicted price for {crop_name_cap} in {district} Mandi is ₹{curr_price} / Quintal. Next month's target is ₹{next_price}. AI Advice: {sentiment}."
            else:
                return "Failed to fetch price predictions. Try again."

        # 2. Weather queries
        weather_keywords = ['weather', 'rain', 'temp', 'temperature', 'climate', 'ಹವಾಮಾನ', 'ಮಳೆ', 'ತಾಪಮಾನ', 'मौसम', 'बारिश', 'तापमान']
        if any(kw in msg_lower for kw in weather_keywords):
            weather_res = WeatherService.get_weather(district)
            if weather_res.get('success'):
                w_data = weather_res['data']['current']
                advisory = weather_res['data']['advisory']
                temp = w_data.get('temperature', 28.0)
                humidity = w_data.get('humidity', 60.0)
                rainfall = w_data.get('rainfall', 10.0)
                
                if lang == 'Kannada':
                    return f"{district} ನಲ್ಲಿ ಪ್ರಸ್ತುತ ಹವಾಮಾನ: ತಾಪಮಾನ {temp}°C, ಆರ್ದ್ರತೆ {humidity}%, ಮತ್ತು ಮಳೆ ಪ್ರಮಾಣ {rainfall}ಮಿಮೀ. ಸಲಹೆ: {advisory}"
                elif lang == 'Hindi':
                    return f"{district} में वर्तमान मौसम: तापमान {temp}°C, आर्द्रता {humidity}%, और वर्षा {rainfall}मिमी। सलाह: {advisory}"
                else:
                    return f"Current weather in {district}: Temp: {temp}°C, Humidity: {humidity}%, Rainfall: {rainfall}mm. Advisory: {advisory}"
            else:
                return "Could not retrieve weather details right now."

        # 3. Disease queries
        disease_keywords = ['disease', 'blight', 'blast', 'rust', 'spot', 'ರೋಗ', 'ಕೀಟ', 'ಬೂಷ್ಟು', 'बीमारी', 'पत्ती', 'ब्लास्ट', 'रस्ट']
        if any(kw in msg_lower for kw in disease_keywords):
            if lang == 'Kannada':
                return "ರೋಗ ಪತ್ತೆಹಚ್ಚಲು ಮತ್ತು ಪರಿಹಾರ ಪಡೆಯಲು ದಯವಿಟ್ಟು ನಮ್ಮ 'Crop Health Scan' ಪುಟಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಎಲೆಯ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ."
            elif lang == 'Hindi':
                return "बीमारी का सटीक पता लगाने और सुधार उर्वरक की जानकारी के लिए कृपया 'Crop Health Scan' पेज पर जाकर पत्ती का फोटो अपलोड करें।"
            else:
                return "To diagnose leaf diseases accurately and get recovery fertilizers, please go to the 'Crop Health Scan' page and upload a leaf image."

        # 4. Soil / Fertilizer queries
        soil_keywords = ['soil', 'fertilizer', 'urea', 'mop', 'npk', 'ಮಣ್ಣು', 'ಗೊಬ್ಬರ', 'ಯೂರಿಯಾ', 'ನೈಟ್ರೋಜನ್', 'मिट्टी', 'खाद', 'उर्वरक']
        if any(kw in msg_lower for kw in soil_keywords):
            advisor_res = AdvisorService.get_smart_recommendation(user_id)
            if advisor_res.get('success'):
                adv = advisor_res['data']
                rec_fert = adv['fertilizer']['recommended_fertilizer']
                tot_qty = adv['fertilizer']['total_quantity']
                reason = adv['fertilizer']['reason']
                
                if lang == 'Kannada':
                    return f"ನಿಮ್ಮ ನೋಂದಾಯಿತ ಮಣ್ಣಿನ ವಿಧ: {soil_type}. ಶಿಫಾರಸು ಮಾಡಿದ ಗೊಬ್ಬರ: {rec_fert}. ನಿಮ್ಮ {land_size} ಎಕರೆಗೆ ಒಟ್ಟು {tot_qty} ಕೆಜಿ ಅಗತ್ಯವಿದೆ. ಕಾರಣ: {reason}"
                elif lang == 'Hindi':
                    return f"आपकी पंजीकृत मिट्टी का प्रकार: {soil_type}। अनुशंसित उर्वरक: {rec_fert}। आपके {land_size} एकड़ के लिए कुल {tot_qty} किलोग्राम की आवश्यकता है। कारण: {reason}"
                else:
                    return f"Your registered soil is {soil_type}. Recommended fertilizer: {rec_fert}. Total quantity needed for {land_size} acres is {tot_qty} kg. Reason: {reason}"
            else:
                return "Failed to load soil parameters."

        # 5. Greetings / General Dialogues
        greetings = ['hi', 'hello', 'hey', 'namaste', 'ನಮಸ್ಕಾರ', 'ಹಲೋ', 'नमस्ते', 'ಹಾಯ್']
        if any(kw in msg_lower for kw in greetings):
            if lang == 'Kannada':
                return f"ನಮಸ್ಕಾರ {farmer_name}! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿ-ಬಾಟ್ ಕೃಷಿ ಸಹಾಯಕಿ. ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ, ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಅಥವಾ ರೋಗಗಳ ಚಿಕಿತ್ಸೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ."
            elif lang == 'Hindi':
                return f"नमस्ते {farmer_name}! मैं आपका एग्री-बॉट कृषि सहायक हूं। मंडी भाव, मौसम की भविष्यवाणी या रोगों के समाधान के बारे में पूछें।"
            else:
                return f"Hello {farmer_name}! I am Agri-bot, your personal AI farming assistant. Ask me questions about mandi prices, local weather advisories, or fertilizer prescriptions."

        # General Fallback
        if lang == 'Kannada':
            return "ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ. ಬೆಳೆ ಬೆಲೆಗಳು, ಮಳೆ ವಿವರಗಳು ಅಥವಾ ರೋಗಗಳ ಕುರಿತು ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ."
        elif lang == 'Hindi':
            return "क्षमा करें, मैं समझ नहीं पा रहा हूँ। फसल की कीमतों, मौसम या बीमारी के बारे में प्रश्न पूछें।"
        else:
            return "I'm here to help you manage your farm! Try asking: 'What is the price of cotton?' or 'Will it rain today?'"
