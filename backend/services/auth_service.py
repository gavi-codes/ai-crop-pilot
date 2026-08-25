from models import User
from extensions import db
from flask_jwt_extended import create_access_token
import datetime

class AuthService:
    @staticmethod
    def register_user(data):
        required_fields = ['name', 'mobile', 'password']
        if not all(field in data for field in required_fields):
            return {'success': False, 'message': 'Missing required fields'}

        if User.query.filter_by(mobile=data['mobile']).first():
            return {'success': False, 'message': 'User with this mobile already exists'}

        try:
            new_user = User(
                name=data['name'],
                mobile=data['mobile'],
                email=data.get('email'),
                district=data.get('district'),
                village=data.get('village'),
                farmer_type=data.get('farmer_type'),
                land_size=data.get('land_size'),
                soil_type=data.get('soil_type'),
                preferred_language=data.get('preferred_language', 'English')
            )
            new_user.set_password(data['password'])
            db.session.add(new_user)
            db.session.commit()
            
            return {
                'success': True,
                'message': 'User registered successfully',
                'data': {'user': new_user.to_dict()}
            }
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'message': str(e)}

    @staticmethod
    def authenticate_user(data):
        mobile = data.get('mobile')
        password = data.get('password')

        if not mobile or not password:
            return {'success': False, 'message': 'Mobile and password required'}

        user = User.query.filter_by(mobile=mobile).first()
        if user and user.check_password(password):
            access_token = create_access_token(identity=str(user.id), expires_delta=datetime.timedelta(days=7))
            return {
                'success': True,
                'message': 'Login successful',
                'data': {
                    'access_token': access_token,
                    'user': user.to_dict()
                }
            }
        
        return {'success': False, 'message': 'Invalid credentials'}
