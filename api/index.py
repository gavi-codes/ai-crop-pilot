import os
import sys

# Add the backend folder to the Python path so imports work perfectly
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

from app import create_app

# Vercel looks for this exact top-level "app" variable
app = create_app()

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
