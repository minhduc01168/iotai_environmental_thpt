from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# Khởi tạo đối tượng SQLAlchemy (sẽ được init trong app.py)
db = SQLAlchemy()

class AqiRecord(db.Model):
    __tablename__ = 'aqi_records' 
    id = db.Column(db.Integer, primary_key=True)
    # Sử dụng DateTime(timezone=True) cho PostgreSQL
    timestamp = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, index=True) 
    
    # Dữ liệu từ API
    aqi_us = db.Column(db.Integer, nullable=False)
    pm25 = db.Column(db.Float, nullable=False)
    
    # Kết quả AI
    diagnosis_label = db.Column(db.String(100))
    aqi_level_label = db.Column(db.String(50))
    
    city = db.Column(db.String(50))

    def to_dict(self):
        # Hàm chuyển đổi object thành dictionary để trả về JSON qua API
        return {
            'id': self.id,
            'timestamp': self.timestamp.strftime('%Y-%m-%dT%H:%M:%S%z'), 
            'aqi_us': self.aqi_us,
            'pm25': self.pm25,
            'diagnosis': self.diagnosis_label,
            'level': self.aqi_level_label,
            'city': self.city
        }