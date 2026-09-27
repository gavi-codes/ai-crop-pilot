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

    import logging
    import sys
    from urllib.parse import urlparse
    from sqlalchemy import text

    logger = logging.getLogger(__name__)
    logging.basicConfig(level=logging.INFO)

    db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    if db_uri and not db_uri.startswith('sqlite'):
        try:
            parsed = urlparse(db_uri)
            logger.info(f"Startup Check -> Host: {parsed.hostname} | Port: {parsed.port} | User: {parsed.username}")
        except Exception as e:
            logger.warning(f"Could not parse database URI for logging: {e}")

    with app.app_context():
        try:
            with db.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Database connection successful.")
            db.create_all()
        except Exception as e:
            logger.error("FATAL: Database connection failed at startup.")
            logger.error(str(e))
            logger.error("Please verify your DATABASE_URL matches the Supabase Dashboard Connect dialog exactly.")
            sys.exit(1)

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
    from routes.admin import admin_bp
    
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
    app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')

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
