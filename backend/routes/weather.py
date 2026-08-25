from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.weather_service import WeatherService

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/<district>', methods=['GET'])
@jwt_required()
def get_weather(district):
    result = WeatherService.get_weather(district)
    return jsonify(result), (200 if result['success'] else 400)
