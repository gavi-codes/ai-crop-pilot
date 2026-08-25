from models.weather import WeatherLog
from extensions import db
import datetime
import random

class WeatherService:
    @staticmethod
    def get_weather(district):
        try:
            today = datetime.date.today()
            
            # Simulated cache check
            log = WeatherLog.query.filter_by(district=district, date=today).first()
            
            if not log:
                # Mocking OpenWeatherMap response
                log = WeatherLog(
                    district=district,
                    date=today,
                    temperature=round(random.uniform(20.0, 38.0), 1),
                    rainfall=round(random.uniform(0, 60.0), 1),
                    humidity=round(random.uniform(40.0, 95.0), 1),
                    wind_speed=round(random.uniform(5.0, 30.0), 1)
                )
                db.session.add(log)
                db.session.commit()
                
            advisory = "Weather looks optimal. Good day for normal farming activities."
            if log.rainfall > 20.0:
                advisory = "Heavy rain expected — avoid spraying fertilizers or pesticides today."
            elif log.temperature > 34.0:
                advisory = "High temperatures expected — ensure adequate irrigation to prevent heat stress."
            elif log.wind_speed > 20.0:
                advisory = "High winds expected — secure lightweight equipment and avoid spraying."
                
            return {
                'success': True,
                'data': {
                    'current': log.to_dict(),
                    'advisory': advisory
                }
            }
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'message': str(e)}
