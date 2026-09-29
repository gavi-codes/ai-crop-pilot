import os
import sys
import traceback
from flask import Flask, jsonify, request

# Step 1: Create a minimal app that always works
app = Flask(__name__)

# Step 2: Try to import the real backend
boot_error = None
real_app = None

try:
    backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
    sys.path.insert(0, backend_path)
    from app import create_app
    real_app = create_app()
except Exception as e:
    boot_error = f"{type(e).__name__}: {e}\n{traceback.format_exc()}"

# Step 3: If real app loaded, use it. Otherwise, serve the error.
if real_app is not None:
    app = real_app
else:
    @app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    @app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    def fallback(path):
        return jsonify({
            'success': False,
            'message': 'Backend failed to boot',
            'error': boot_error,
            'python_version': sys.version,
            'env_vars': list(os.environ.keys()),
        }), 500

# Vercel WSGI Fix
class VercelProxyFix:
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app
    def __call__(self, environ, start_response):
        request_uri = environ.get('REQUEST_URI', '')
        if request_uri:
            environ['PATH_INFO'] = request_uri.split('?')[0]
            environ['SCRIPT_NAME'] = ''
        return self.wsgi_app(environ, start_response)

app.wsgi_app = VercelProxyFix(app.wsgi_app)

if __name__ == '__main__':
    app.run()
