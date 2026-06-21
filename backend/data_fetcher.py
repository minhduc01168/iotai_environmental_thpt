import requests
from datetime import datetime
from .config import IQAIR_API_KEY, TARGET_CITY

# Tọa độ Hà Nội (Vì API này dùng tọa độ thay vì tên thành phố)
LAT = 21.0285
LON = 105.8542

def fetch_iqair_data():
    """
    Hàm lấy dữ liệu từ OpenWeatherMap Air Pollution API
    và chuyển đổi sang định dạng cũ để không làm hỏng logic của app.py.
    """
    # URL chính xác của OpenWeatherMap Air Pollution
    base_url = "http://api.openweathermap.org/data/2.5/air_pollution"
    
    params = {
        "lat": LAT,
        "lon": LON,
        "appid": IQAIR_API_KEY
    }
    
    try:
        response = requests.get(base_url, params=params, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        # Kiểm tra xem có dữ liệu trong danh sách không
        if not data.get('list'):
            return None
            
        # Lấy bản ghi đầu tiên (hiện tại)
        current_data = data['list'][0]
        components = current_data['components'] # Chứa: co, no, no2, o3, so2, pm2_5, pm10, nh3
        dt_timestamp = current_data['dt']
        
        # --- QUAN TRỌNG: TÍNH TOÁN AQI GIẢ ĐỊNH ---
        # API này chỉ trả về 'aqi' mức 1-5, không phải chỉ số AQI Mỹ (0-500).
        # Ta cần tính AQI Mỹ từ PM2.5 để app.py hiểu được (vì app.py check aqi_us > 0).
        # Công thức tính nhanh AQI từ PM2.5 (tham khảo EPA):
        pm25 = components['pm2_5']
        aqi_us = 0
        
        if pm25 <= 12.0:
            aqi_us = ((50 - 0) / (12.0 - 0)) * (pm25 - 0) + 0
        elif pm25 <= 35.4:
            aqi_us = ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51
        elif pm25 <= 55.4:
            aqi_us = ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101
        elif pm25 <= 150.4:
            aqi_us = ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151
        else:
            aqi_us = ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201

        # Trả về cấu trúc dữ liệu khớp với code cũ (IQAir format)
        return {
            "aqi_us": int(aqi_us),       # Đã tính toán ở trên
            "p2": components['pm2_5'],   # Dữ liệu PM2.5 (60.22)
            "pm10": components['pm10'],  # Dữ liệu PM10 (70.52)
            "co": components['co'],
            "no2": components['no2'],
            "o3": components['o3'],
            "so2": components['so2'],
            "ts": datetime.fromtimestamp(dt_timestamp).strftime('%Y-%m-%dT%H:%M:%S')
        }
        
    except Exception as e:
        print(f"Lỗi khi gọi API: {e}")
        return None