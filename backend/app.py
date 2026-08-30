from flask import Flask
from config import Config
from extensions import db, migrate, jwt
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    import models  # Important for Alembic to detect models

    # Register blueprints
    from routes.auth import auth_bp
    from routes.soil import soil_bp
    from routes.fertilizer import fertilizer_bp
    from routes.weather import weather_bp
    from routes.disease import disease_bp
    from routes.price import price_bp
    from routes.advisor import advisor_bp
    from routes.chatbot import chatbot_bp
    from routes.scheme import scheme_bp
    from routes.maturity import maturity_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(soil_bp, url_prefix='/api/v1/soil')
    app.register_blueprint(fertilizer_bp, url_prefix='/api/v1/fertilizer')
    app.register_blueprint(weather_bp, url_prefix='/api/v1/weather')
    app.register_blueprint(disease_bp, url_prefix='/api/v1/disease')
    app.register_blueprint(price_bp, url_prefix='/api/v1/price')
    app.register_blueprint(advisor_bp, url_prefix='/api/v1/advisor')
    app.register_blueprint(chatbot_bp, url_prefix='/api/v1/chatbot')
    app.register_blueprint(scheme_bp, url_prefix='/api/v1/schemes')
    app.register_blueprint(maturity_bp, url_prefix='/api/v1/maturity')

    @app.route('/api/health')
    def health_check():
        return {'success': True, 'data': {'status': 'healthy'}, 'message': 'API is running'}

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db.session.remove()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
