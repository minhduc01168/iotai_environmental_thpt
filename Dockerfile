# Sử dụng base image Python chính thức
FROM python:3.10-slim

# Thiết lập biến môi trường
ENV PYTHONUNBUFFERED 1
ENV APP_HOME=/app
WORKDIR $APP_HOME

# Copy file requirements và cài đặt dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code ứng dụng vào image
# Giả định folder backend của bạn tên là 'backend'
COPY backend/ $APP_HOME/backend/

# COPY ĐÃ CHỈNH SỬA: Copy thư mục mô hình AI (weight/) vào thư mục ứng dụng
# Cần đảm bảo bạn có thư mục 'weight/' chứa các file *.joblib nằm cùng cấp với Dockerfile.
COPY weight/ $APP_HOME/weight/

# Lệnh chạy ứng dụng dưới dạng module
CMD ["python", "-m", "backend.app"]