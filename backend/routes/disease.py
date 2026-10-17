from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.disease_service import DiseaseService

disease_bp = Blueprint('disease', __name__)

@disease_bp.route('/predict', methods=['POST'])
@disease_bp.route('/analyze', methods=['POST'])
@jwt_required()
def predict():
    user_id = get_jwt_identity()
    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            result = DiseaseService.analyze_image(user_id, file)
            return jsonify(result), (200 if result['success'] else 500)

    data = request.get_json(silent=True) or {}
    if 'image' in data:
        import base64
        from io import BytesIO
        img_str = str(data['image'])
        if ',' in img_str:
            img_str = img_str.split(',')[1]
        try:
            img_bytes = base64.b64decode(img_str)
        except Exception:
            img_bytes = b'placeholder'
        bio = BytesIO(img_bytes)
        bio.filename = 'leaf_capture.jpg'
        result = DiseaseService.analyze_image(user_id, bio)
        return jsonify(result), (200 if result['success'] else 500)
        
    return jsonify({'success': False, 'message': 'No image part provided'}), 400
