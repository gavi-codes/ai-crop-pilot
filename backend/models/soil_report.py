from extensions import db
from datetime import datetime

class SoilReport(db.Model):
    __tablename__ = 'soil_reports'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nitrogen = db.Column(db.Float, nullable=False)
    phosphorus = db.Column(db.Float, nullable=False)
    potassium = db.Column(db.Float, nullable=False)
    ph = db.Column(db.Float, nullable=False)
    moisture = db.Column(db.Float, nullable=False)
    health_verdict = db.Column(db.String(255), nullable=True)
    suitable_crops = db.Column(db.String(255), nullable=True) # comma separated
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'nitrogen': self.nitrogen,
            'phosphorus': self.phosphorus,
            'potassium': self.potassium,
            'ph': self.ph,
            'moisture': self.moisture,
            'health_verdict': self.health_verdict,
            'suitable_crops': self.suitable_crops.split(',') if self.suitable_crops else [],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
