import os
import sys
import traceback
from flask import Flask, jsonify

# Add the backend folder to the Python path so imports work perfectly
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

try:
    from app import create_app
    app = create_app()
except Exception as e:
    app = Flask(__name__)
    error_trace = traceback.format_exc()
    @app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    @app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    def catch_all(path):
        return jsonify({
            'success': False, 
            'message': f"FATAL BOOT ERROR: {str(e)}",
            'trace': error_trace
        }), 200

# Vercel WSGI Fix
class VercelProxyFix:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        request_uri = environ.get('REQUEST_URI', '')
        if request_uri:
            path_info = request_uri.split('?')[0]
            environ['PATH_INFO'] = path_info
            environ['SCRIPT_NAME'] = ''
        return self.app(environ, start_response)

app.wsgi_app = VercelProxyFix(app.wsgi_app)

if __name__ == '__main__':
    app.run()
