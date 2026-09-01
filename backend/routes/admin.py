from flask import Blueprint, jsonify
from models.user import User
from models.disease_report import DiseaseReport
from extensions import db

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    try:
        users = User.query.all()
        disease_reports = DiseaseReport.query.all()
        
        user_list = [user.to_dict() for user in users]
        report_list = [
            {
                'id': report.id,
                'user_id': report.user_id,
                'crop_type': report.crop_type,
                'disease_name': report.disease_name,
                'confidence': report.confidence,
                'created_at': report.created_at.isoformat() if report.created_at else None
            } for report in disease_reports
        ]
        
        return jsonify({
            'success': True,
            'data': {
                'total_users': len(users),
                'total_reports': len(disease_reports),
                'users': user_list,
                'recent_reports': report_list[-10:] # Last 10 reports
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
