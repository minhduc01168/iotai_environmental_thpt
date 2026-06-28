from flask import Flask, jsonify
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

from .config import POSTGRES_URI, UPDATE_INTERVAL_MINUTES, TARGET_CITY
from .models import db, AqiRecord
from .data_fetcher import fetch_iqair_data
from .ai_service import run_ai_diagnosis

# --- 1. KHỞI TẠO FLASK VÀ CSDL ---
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = POSTGRES_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Kết nối đối tượng db từ models.py với ứng dụng Flask
db.init_app(app)


# --- 2. SCHEDULER (TÁC VỤ NỀN) ---

def update_aqi_job():
    """Tác vụ chạy định kỳ: Lấy dữ liệu -> Chạy AI -> Lưu vào DB."""
    with app.app_context():
        try:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Bắt đầu cập nhật AQI...")
            new_iqair_data = fetch_iqair_data()
            
            if new_iqair_data and new_iqair_data['p2'] > 0:
                # Chạy dịch vụ AI
                diagnosis, level, aqi_class = run_ai_diagnosis(new_iqair_data)
                
                # Tạo bản ghi mới
                new_record = AqiRecord(
                    aqi_us=new_iqair_data['aqi_us'],
                    pm25=new_iqair_data['p2'],
                    diagnosis_label=diagnosis,
                    aqi_level_label=level,
                    timestamp=datetime.now(),
                    city=TARGET_CITY
                )
                
                db.session.add(new_record)
                db.session.commit()
                
                print(f"Ghi bản ghi mới vào DB. AQI: {new_iqair_data['aqi_us']}, Chẩn đoán: {diagnosis}")
                
                # Kiểm tra Thông báo Cảnh báo
                if new_iqair_data['aqi_us'] >= 150:
                     print("!!! Kích hoạt CẢNH BÁO NGUY HIỂM.")

            else:
                print("Không thể lấy dữ liệu IQAir.")
        
        except Exception as e:
            db.session.rollback()
            print(f"LỖI HỆ THỐNG TRONG SCHEDULER: {e}")

# Thiết lập Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(update_aqi_job, 'interval', minutes=UPDATE_INTERVAL_MINUTES) 


# --- 3. CÁC ENDPOINT API ---

@app.route('/api/latest_aqi', methods=['GET'])
def get_latest_aqi():
    """Endpoint 1: Trả về chỉ số AQI mới nhất từ Database."""
    with app.app_context():
        latest_record = AqiRecord.query.order_by(AqiRecord.id.desc()).first()
        if latest_record:
            return jsonify(latest_record.to_dict())
        return jsonify({"error": "No data available"}), 404

@app.route('/api/history', methods=['GET'])
def get_aqi_history():
    """Endpoint 2: Trả về lịch sử 24 điểm dữ liệu gần nhất để vẽ biểu đồ."""
    with app.app_context():
        history_records = AqiRecord.query.order_by(AqiRecord.id.desc()).limit(24).all()
        history_records.reverse() 
        return jsonify([record.to_dict() for record in history_records])

@app.route('/', methods=['GET'])
def index():
    return "Hệ thống Backend AQI đang hoạt động. Truy cập /api/latest_aqi và /api/history"

if __name__ == '__main__':
    with app.app_context():
        # Tạo bảng nếu chưa tồn tại
        db.create_all()
        # Chạy tác vụ lần đầu để có dữ liệu khởi tạo
        update_aqi_job() 
        
    scheduler.start()
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)