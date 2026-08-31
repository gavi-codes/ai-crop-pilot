from models.disease_report import CropDiseaseReport
from ml.disease_model.predict import predict_disease
from extensions import db
import os
import uuid

class DiseaseService:
    @staticmethod
    def analyze_image(user_id, file):
        try:
            import tempfile
            upload_dir = tempfile.gettempdir()
            
            filename = f"{uuid.uuid4()}_{file.filename}"
            file_path = os.path.join(upload_dir, filename)
            file.save(file_path)
            
            # 2. Run ML prediction
            prediction = predict_disease(file_path)
            
            # 3. Save to database
            report = CropDiseaseReport(
                user_id=user_id,
                image_url=file_path,  # In production, this would be an S3 URL
                disease_name=prediction['disease_name'],
                confidence=prediction['confidence'],
                treatment=prediction['treatment_json'],
                prevention=prediction['prevention'],
                description_json=prediction['description_json'],
                treatment_json=prediction['treatment_json'],
                recovery_fertilizer_json=prediction['recovery_fertilizer_json']
            )
            db.session.add(report)
            db.session.commit()
            
            return {
                'success': True, 
                'message': 'Disease analysis complete',
                'data': report.to_dict()
            }
            
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'message': str(e)}
