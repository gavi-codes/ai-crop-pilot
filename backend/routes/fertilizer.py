from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.fertilizer_service import FertilizerService

fertilizer_bp = Blueprint('fertilizer', __name__)

@fertilizer_bp.route('/recommend', methods=['POST'])
@jwt_required()
def recommend():
    user_id = get_jwt_identity()
    data = request.get_json()
    result = FertilizerService.recommend(user_id, data)
    return jsonify(result), (200 if result['success'] else 400)
