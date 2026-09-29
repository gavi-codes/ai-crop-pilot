from flask import Flask, jsonify
from config import Config
from extensions import db, migrate, jwt
from flask_cors import CORS
import os
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    import models  # Important for Alembic to detect models

    from urllib.parse import urlparse

    db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    if db_uri and not db_uri.startswith('sqlite'):
        try:
            parsed = urlparse(db_uri)
            logger.info(f"Startup Check -> Host: {parsed.hostname} | Port: {parsed.port} | User: {parsed.username}")
        except Exception as e:
            logger.warning(f"Could not parse database URI for logging: {e}")

    with app.app_context():
        try:
            if os.environ.get('VERCEL') != '1':
                db.create_all()
        except Exception:
            pass

    # ---- Register Blueprints ----
    # Lightweight routes (always load)
    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')

    from routes.weather import weather_bp
    app.register_blueprint(weather_bp, url_prefix='/api/v1/weather')

    from routes.scheme import scheme_bp
    app.register_blueprint(scheme_bp, url_prefix='/api/v1/schemes')

    # Heavy routes that depend on pandas/sklearn/pillow - load gracefully
    heavy_routes = [
        ('routes.soil', 'soil_bp', '/api/v1/soil'),
        ('routes.fertilizer', 'fertilizer_bp', '/api/v1/fertilizer'),
        ('routes.disease', 'disease_bp', '/api/v1/disease'),
        ('routes.price', 'price_bp', '/api/v1/price'),
        ('routes.advisor', 'advisor_bp', '/api/v1/advisor'),
        ('routes.chatbot', 'chatbot_bp', '/api/v1/chatbot'),
        ('routes.maturity', 'maturity_bp', '/api/v1/maturity'),
        ('routes.admin', 'admin_bp', '/api/v1/admin'),
    ]

    for module_name, bp_name, url_prefix in heavy_routes:
        try:
            module = __import__(module_name, fromlist=[bp_name])
            bp = getattr(module, bp_name)
            app.register_blueprint(bp, url_prefix=url_prefix)
        except Exception as e:
            logger.warning(f"Skipped {module_name}: {e}")

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
