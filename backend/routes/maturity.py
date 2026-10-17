from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.maturity_service import MaturityService

maturity_bp = Blueprint('maturity', __name__)

@maturity_bp.route('/analyze', methods=['POST'])
@maturity_bp.route('/predict', methods=['POST'])
@jwt_required()
def analyze():
    user_id = get_jwt_identity()
    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            result = MaturityService.analyze_image(user_id, file)
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
        bio.filename = 'camera_capture.jpg'
        result = MaturityService.analyze_image(user_id, bio)
        return jsonify(result), (200 if result['success'] else 500)
        
    return jsonify({'success': False, 'message': 'No image part provided'}), 400
