from flask import Flask, jsonify
from config import Config
from extensions import db, migrate, jwt
from flask_cors import CORS
import os
import logging
from urllib.parse import urlparse

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    if db_uri and not db_uri.startswith('sqlite'):
        try:
            parsed = urlparse(db_uri)
            logger.info(f"Startup Check -> Host: {parsed.hostname} | Port: {parsed.port} | User: {parsed.username}")
            import psycopg2
            import threading

            is_connected = [False]
            conn_error = [None]

            def _test_conn():
                try:
                    conn = psycopg2.connect(db_uri, connect_timeout=2)
                    conn.close()
                    is_connected[0] = True
                except Exception as e:
                    conn_error[0] = str(e)

            thread = threading.Thread(target=_test_conn, daemon=True)
            thread.start()
            thread.join(timeout=2.0)

            if is_connected[0]:
                logger.info("Primary database connection verified successfully!")
            else:
                reason = conn_error[0] if conn_error[0] else "Connection timed out after 2s"
                logger.warning(f"Primary database connection unavailable ({reason}). Switching to self-healing SQLite database.")
                sqlite_path = '/tmp/crop_pilot.db' if os.environ.get('VERCEL') == '1' else 'crop_pilot.db'
                app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{sqlite_path}'
                app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {}
        except Exception as e:
            logger.warning(f"Database pre-flight check error ({e}). Switching to self-healing SQLite database.")
            sqlite_path = '/tmp/crop_pilot.db' if os.environ.get('VERCEL') == '1' else 'crop_pilot.db'
            app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{sqlite_path}'
            app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {}

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    import models

    with app.app_context():
        try:
            db.create_all()
            from models import User
            if not User.query.filter_by(mobile="9876543210").first():
                demo = User(
                    name="Ramesh Patil",
                    mobile="9876543210",
                    district="Koppal",
                    farmer_type="Individual",
                    land_size=2.5,
                    soil_type="Red Soil"
                )
                demo.set_password("Password123!")
                db.session.add(demo)
                db.session.commit()
                logger.info("Demo farmer account (9876543210 / Password123!) ready.")
        except Exception as se:
            logger.warning(f"Database table initialization notice: {se}")

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
