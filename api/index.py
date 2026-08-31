import os
import sys

# Add the backend folder to the Python path so imports work perfectly
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

from app import create_app

# Vercel looks for the "app" variable to serve the WSGI app
app = create_app()

# Vercel WSGI Fix: When Vercel rewrites requests to /api/index.py, 
# it sometimes messes up the PATH_INFO and SCRIPT_NAME.
# This middleware forcefully restores the original request path from the headers or URI.
class VercelProxyFix:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        # The original URL is always passed by Vercel in the HTTP_X_NOW_ROUTE_MATCHES 
        # or HTTP_X_FORWARDED_URI or we can reconstruct it.
        # But commonly, the raw URI is in environ['REQUEST_URI']
        request_uri = environ.get('REQUEST_URI', '')
        if request_uri:
            # Strip query string
            path_info = request_uri.split('?')[0]
            environ['PATH_INFO'] = path_info
            environ['SCRIPT_NAME'] = ''
        return self.app(environ, start_response)

app.wsgi_app = VercelProxyFix(app.wsgi_app)

if __name__ == '__main__':
    app.run()
