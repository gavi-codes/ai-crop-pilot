from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.soil_service import SoilService

soil_bp = Blueprint('soil', __name__)

@soil_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze():
    user_id = get_jwt_identity()
    data = request.get_json()
    result = SoilService.analyze_soil(user_id, data)
    return jsonify(result), (200 if result['success'] else 400)
