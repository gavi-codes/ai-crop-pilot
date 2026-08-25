from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.chatbot_service import ChatbotService

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/query', methods=['POST'])
@jwt_required()
def query_bot():
    data = request.get_json() or {}
    message = data.get('message', '')
    
    if not message:
        return jsonify({'success': False, 'message': 'Message is required'}), 400
        
    user_id = get_jwt_identity()
    response = ChatbotService.get_bot_response(user_id, message)
    
    return jsonify({
        'success': True,
        'response': response
    }), 200
