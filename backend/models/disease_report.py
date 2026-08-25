from extensions import db
from datetime import datetime
import json

class CropDiseaseReport(db.Model):
    __tablename__ = 'crop_disease_reports'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=True) # local path or URL
    disease_name = db.Column(db.String(100), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    treatment = db.Column(db.Text, nullable=True)
    prevention = db.Column(db.Text, nullable=True)
    description_json = db.Column(db.Text, nullable=True) # English/Kannada/Hindi
    treatment_json = db.Column(db.Text, nullable=True) # English/Kannada/Hindi
    recovery_fertilizer_json = db.Column(db.Text, nullable=True) # English/Kannada/Hindi
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        try:
            desc_dict = json.loads(self.description_json) if self.description_json else {}
        except Exception:
            desc_dict = {"English": self.description_json or ""}
            
        try:
            treat_dict = json.loads(self.treatment_json) if self.treatment_json else {}
        except Exception:
            treat_dict = {"English": self.treatment or ""}

        try:
            fert_dict = json.loads(self.recovery_fertilizer_json) if self.recovery_fertilizer_json else {}
        except Exception:
            fert_dict = {"English": ""}

        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_url': self.image_url,
            'disease_name': self.disease_name,
            'confidence': self.confidence,
            'treatment': self.treatment,
            'prevention': self.prevention,
            'description_json': desc_dict,
            'treatment_json': treat_dict,
            'recovery_fertilizer_json': fert_dict,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
