from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.advisor_service import AdvisorService

advisor_bp = Blueprint('advisor', __name__)

@advisor_bp.route('/recommend', methods=['GET'])
@jwt_required()
def recommend():
    user_id = get_jwt_identity()
    result = AdvisorService.get_smart_recommendation(user_id)
    if result.get('success'):
        return jsonify(result), 200
    return jsonify(result), 400
