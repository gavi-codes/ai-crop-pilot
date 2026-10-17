import os
import re
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-dev-key')
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        if os.environ.get('VERCEL') == '1':
            database_url = 'sqlite:////tmp/crop_pilot.db'
        else:
            database_url = 'sqlite:///crop_pilot.db'
            
    if isinstance(database_url, str):
        database_url = database_url.strip()
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
        
    # Auto-repair missing @ before aws-0 or pooler.supabase.com
    if 'pooler.supabase.com' in database_url:
        auth_host_part = database_url.split('://')[1].split('/')[0] if '://' in database_url else ''
        if '@' not in auth_host_part:
            database_url = re.sub(
                r'(:[^@/]+?)(?:@?aws)?(-0-[a-z0-9-]+\.pooler\.supabase\.com)', 
                r'\1@aws\2', 
                database_url
            )

    if 'sslmode=' not in database_url and 'pooler.supabase.com' in database_url:
        if '?' in database_url:
            database_url += '&sslmode=require'
        else:
            database_url += '?sslmode=require'

    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-super-secret')
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 5,
        'max_overflow': 10,
        'pool_timeout': 4,
        'pool_recycle': 120,
        'connect_args': {'connect_timeout': 3}
    }
