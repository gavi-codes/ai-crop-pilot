from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.disease_service import DiseaseService

disease_bp = Blueprint('disease', __name__)

@disease_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'No image part provided'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected image'}), 400
        
    user_id = get_jwt_identity()
    result = DiseaseService.analyze_image(user_id, file)
    return jsonify(result), (200 if result['success'] else 500)
