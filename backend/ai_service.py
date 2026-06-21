import joblib
import pandas as pd
from datetime import datetime
from .config import MODEL_FILES, AQI_LEVELS, DIAGNOSIS_LABELS

# --- TẢI MÔ HÌNH VÀ CÁC THAM SỐ ---
try:
    SCALER = joblib.load(MODEL_FILES["SCALER"])
    KMEANS_MODEL = joblib.load(MODEL_FILES["KMEANS"])
    RF_CLASSIFIER = joblib.load(MODEL_FILES["RF_CLASSIFIER"])
    print("Mô hình AI đã được tải thành công.")
except FileNotFoundError as e:
    print(f"LỖI TẢI MÔ HÌNH: Không tìm thấy {e.filename}. Hãy đảm bảo bạn đã chạy Notebook và các file joblib nằm trong thư mục gốc.")
    exit()

def run_ai_diagnosis(new_data):
    """
    Áp dụng mô hình Clustering (Chẩn đoán Nguồn) và Classification (Dự báo Mức độ)
    trên dữ liệu mới.
    """
    current_time = datetime.now()
    
    # ⚠️ QUAN TRỌNG: Xây dựng feature vector PHẢI giống hệt lúc huấn luyện
    # Điền giá trị mặc định cho các chất không có trong IQAir API miễn phí
    # Sử dụng dữ liệu thật từ OpenWeatherMap
    data_for_model = pd.DataFrame([{
        'pm25': new_data.get('p2', 0), 
        'pm10': new_data.get('pm10', 0), 
        'o3': new_data.get('o3', 0), 
        'no2': new_data.get('no2', 0), 
        'so2': new_data.get('so2', 0), 
        'co': new_data.get('co', 0), 
        'Month': current_time.month,
        'DayOfWeek': current_time.weekday(),
        'DayOfYear': current_time.timetuple().tm_yday
    }])
    
    clustering_features = data_for_model[['pm25', 'pm10', 'o3', 'no2', 'so2', 'co']]
    
    # 1. Chẩn đoán Nguồn (Clustering)
    X_scaled = SCALER.transform(clustering_features)
    cluster_label = KMEANS_MODEL.predict(X_scaled)[0]
    diagnosis_result = DIAGNOSIS_LABELS.get(cluster_label, "Không xác định")
    
    # 2. Dự báo Mức độ (Classification)
    features_cols_for_rf = ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co', 'Month', 'DayOfWeek', 'DayOfYear']
    aqi_class = RF_CLASSIFIER.predict(data_for_model[features_cols_for_rf])[0]
    level_result = AQI_LEVELS.get(aqi_class, "Không xác định")
    
    return diagnosis_result, level_result, aqi_class