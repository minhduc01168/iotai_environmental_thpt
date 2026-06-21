# --- CẤU HÌNH POSTGRESQL ---
# Định dạng: postgresql://[user]:[password]@[host]:[port]/[database_name]
POSTGRES_URI = "postgresql+psycopg2://admin1681:admin1681@db:5432/aqi_vietnam_db"

# --- CẤU HÌNH API IQAir ---
IQAIR_API_KEY = "015bbd93df97b4e2d1a18b532788b5c3"
TARGET_CITY = "Hanoi"
TARGET_STATE = "Hanoi"
TARGET_COUNTRY = "Vietnam"

# --- THỜI GIAN CẬP NHẬT (SCHEDULER) ---
# Tần suất gọi API IQAir (phút). Đặt 90 phút để an toàn trong gói miễn phí.
UPDATE_INTERVAL_MINUTES = 15

# --- CẤU HÌNH MÔ HÌNH AI ---
MODEL_FILES = {
    "SCALER": "weight/scaler_clustering.joblib",
    "KMEANS": "weight/kmeans_diagnosis_model.joblib",
    "RF_CLASSIFIER": "weight/rf_classification_model.joblib",
}

# --- ÁNH XẠ KẾT QUẢ AI ---
AQI_LEVELS = {0: "Tốt", 1: "Trung bình", 2: "Kém", 3: "Xấu", 4: "Nguy hại"}

# ⚠️ THAY ĐỔI NHÃN NÀY DỰA TRÊN PHÂN TÍCH CLUSTERING CỦA BẠN ⚠️
DIAGNOSIS_LABELS = {
    0: "Mức ô nhiễm thấp/Trung bình",
    1: "Bụi/Xây dựng (PM2.5 cao)",
    2: "Khí thải Giao thông (NO2 & CO cao)",
    3: "Ô nhiễm Quang hóa (O3 cao)",
}