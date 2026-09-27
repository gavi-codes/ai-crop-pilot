import sys
with open('backend/app.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = content.replace(
'''    # Fail-safe to create tables if they don't exist
    with app.app_context():
        try:
            db.create_all()
        except Exception:
            pass''',
'''    import logging
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
            sys.exit(1)'''
)

with open('backend/app.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

with open('backend/.env', 'r', encoding='utf-8') as f:
    env_content = f.read()

env_content = env_content.replace('# DATABASE_URL=', 'DATABASE_URL=')
with open('backend/.env', 'w', encoding='utf-8') as f:
    f.write(env_content)
