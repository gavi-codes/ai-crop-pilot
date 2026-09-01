from flask import Blueprint, request, jsonify
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json(force=True, silent=True) or {}
        result = AuthService.register_user(data)
        if result.get('success'):
            return jsonify(result), 201
        return jsonify(result), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json(force=True, silent=True) or {}
        result = AuthService.authenticate_user(data)
        if result.get('success'):
            return jsonify(result), 200
        return jsonify(result), 401
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500
