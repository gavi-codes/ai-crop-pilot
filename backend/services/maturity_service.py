import os
import uuid
from ml.maturity_model.predict import predict_maturity

class MaturityService:
    @staticmethod
    def analyze_image(user_id, file):
        try:
            import tempfile
            upload_dir = tempfile.gettempdir()
            
            filename = f"maturity_{uuid.uuid4()}_{file.filename}"
            file_path = os.path.join(upload_dir, filename)
            file.save(file_path)
            
            prediction = predict_maturity(file_path)
            
            if not prediction.get('success', True):
                return prediction
            
            return {
                'success': True, 
                'message': 'Maturity analysis complete',
                'data': {
                    'image_url': f"/uploads/{filename}",
                    **prediction
                }
            }
            
        except Exception as e:
            return {'success': False, 'message': str(e)}
