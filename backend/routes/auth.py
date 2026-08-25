from flask import Blueprint, request, jsonify
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    result = AuthService.register_user(data)
    if result.get('success'):
        return jsonify(result), 201
    return jsonify(result), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    result = AuthService.authenticate_user(data)
    if result.get('success'):
        return jsonify(result), 200
    return jsonify(result), 401
