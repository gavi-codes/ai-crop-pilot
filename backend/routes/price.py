from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.price_service import PriceService

price_bp = Blueprint('price', __name__)

@price_bp.route('/predict', methods=['GET', 'POST'])
@jwt_required()
def get_prediction():
    if request.method == 'POST':
        data = request.get_json(silent=True) or {}
        crop = data.get('crop') or request.args.get('crop')
        district = data.get('district') or request.args.get('district')
    else:
        crop = request.args.get('crop')
        district = request.args.get('district')
    
    if not crop or not district:
        return jsonify({'success': False, 'message': 'Crop and district are required'}), 400
        
    user_id = get_jwt_identity()
    result = PriceService.predict_price(district, crop, user_id)
    return jsonify(result), (200 if result['success'] else 500)
