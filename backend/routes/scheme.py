from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.scheme_service import SchemeService

scheme_bp = Blueprint('scheme', __name__)

@scheme_bp.route('/eligible', methods=['GET'])
@jwt_required()
def get_eligible_schemes():
    user_id = get_jwt_identity()
    result = SchemeService.get_eligible_schemes(user_id)
    return jsonify(result), (200 if result['success'] else 500)
