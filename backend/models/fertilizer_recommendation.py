from extensions import db
from datetime import datetime

class FertilizerRecommendation(db.Model):
    __tablename__ = 'fertilizer_recommendations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    crop = db.Column(db.String(100), nullable=False)
    soil_report_id = db.Column(db.Integer, db.ForeignKey('soil_reports.id'), nullable=True)
    growth_stage = db.Column(db.String(50), nullable=False)
    recommended_fertilizer = db.Column(db.String(255), nullable=False)
    quantity_per_acre = db.Column(db.Float, nullable=False) # in kg
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'crop': self.crop,
            'soil_report_id': self.soil_report_id,
            'growth_stage': self.growth_stage,
            'recommended_fertilizer': self.recommended_fertilizer,
            'quantity_per_acre': self.quantity_per_acre,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
