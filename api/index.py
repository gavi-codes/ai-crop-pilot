import os
import sys

# Add the backend folder to the Python path so imports work perfectly
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

from app import create_app

# Vercel looks for the "app" variable to serve the WSGI app
app = create_app()

if __name__ == '__main__':
    app.run()
