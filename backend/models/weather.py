from extensions import db
from datetime import datetime

class WeatherLog(db.Model):
    __tablename__ = 'weather_logs'

    id = db.Column(db.Integer, primary_key=True)
    district = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    rainfall = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    wind_speed = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'district': self.district,
            'date': self.date.isoformat() if self.date else None,
            'temperature': self.temperature,
            'rainfall': self.rainfall,
            'humidity': self.humidity,
            'wind_speed': self.wind_speed,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
