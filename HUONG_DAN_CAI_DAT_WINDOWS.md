# 🖥️ Hướng dẫn Cài đặt & Chạy Dự án trên Windows (Dành cho Người mới)

Chào mừng bạn đến với dự án **Hệ thống Giám sát & Cảnh báo Chất lượng Không khí AI (AQI)**! 🌍🤖

Tài liệu này được viết theo phương châm **"Từng bước một - Dễ hiểu - Ai cũng làm được"** nhằm giúp các bạn học sinh, sinh viên hoặc người mới bắt đầu làm quen với lập trình có thể tự tay cài đặt và khởi chạy dự án thành công trên máy tính sử dụng hệ điều hành **Windows**.

---

## 📌 Bạn nên chọn cách cài đặt nào?

Có **2 cách** để khởi chạy dự án này trên Windows:

| Phương thức | Độ khó | Thời gian chuẩn bị | Ưu điểm nổi bật |
| :--- | :---: | :---: | :--- |
| **🌟 Cách 1: Dùng Docker Desktop**<br>*(Khuyên dùng cho người mới)* | 🟢 **Rất dễ** | ~10 - 15 phút | • Chỉ cần chạy **1 câu lệnh duy nhất**.<br>• Tự động cài đặt đầy đủ AI, Database, Web.<br>• Không lo lỗi phiên bản Python hay Node.js. |
| **🛠️ Cách 2: Cài đặt thủ công**<br>*(Dành cho ai muốn học lập trình sâu)* | 🟡 **Trung bình** | ~20 - 30 phút | • Hiểu rõ cách hoạt động của từng thành phần.<br>• Dễ dàng chỉnh sửa code và xem thay đổi ngay lập tức. |

---

## 🌟 CÁCH 1: Cài đặt Tự động bằng Docker Desktop (Khuyên dùng)

Đây là cách đơn giản và ít gặp lỗi nhất vì toàn bộ môi trường (Python, React, Cơ sở dữ liệu PostgreSQL) đã được đóng gói sẵn.

### Bước 1: Cài đặt các phần mềm cần thiết
1. **Tải và cài đặt Visual Studio Code (VS Code):**
   - Truy cập trang chủ: 👉 [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Tải bộ cài cho Windows và ấn `Next` liên tục để cài đặt.
2. **Tải và cài đặt Docker Desktop:**
   - Truy cập trang chủ: 👉 [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
   - Tải bản **Docker Desktop for Windows** và cài đặt.
   - **⚠️ Lưu ý quan trọng:** Sau khi cài đặt xong, bạn **bắt buộc phải mở phần mềm Docker Desktop lên** và để phần mềm chạy ngầm (nhìn thấy biểu tượng hình chú cá voi ở góc dưới bên phải màn hình hiển thị trạng thái **"Engine running"** màu xanh lá).

---

### Bước 2: Mở dự án trong Terminal
1. Mở thư mục chứa dự án `iotai_environmental_thpt`.
2. Nhấn chuột phải vào khoảng trống trong thư mục, chọn **"Open with Code"** để mở dự án bằng VS Code.
3. Trong giao diện VS Code, trên thanh menu phía trên chọn **Terminal** ➔ **New Terminal** (hoặc bấm tổ hợp phím `Ctrl` + `` ` ``). Một bảng gõ lệnh sẽ xuất hiện ở góc dưới màn hình.

---

### Bước 3: Khởi chạy hệ thống với 1 câu lệnh duy nhất
Tại bảng Terminal vừa mở, bạn copy và dán câu lệnh sau rồi nhấn `Enter`:

```bash
docker compose up --build
```

⏳ **Quá trình tải và cài đặt tự động sẽ bắt đầu:**
- Ở lần đầu tiên chạy, máy sẽ mất khoảng **3 - 5 phút** để tải các mô hình Trí tuệ Nhân tạo (AI), các thư viện Python và Node.js về máy. Hãy kiên nhẫn chờ đợi nhé!
- Khi bạn thấy dòng chữ thông báo tương tự như `server listening on http://0.0.0.0:80` hoặc các dịch vụ hiển thị màu xanh (`Started`), nghĩa là hệ thống đã sẵn sàng!

---

### Bước 4: Truy cập Trình duyệt & Trải nghiệm
- Bạn mở trình duyệt web bất kỳ (Google Chrome, Microsoft Edge...), gõ vào thanh địa chỉ:
  👉 **http://localhost:3000**
- Giao diện giám sát chất lượng không khí thông minh sẽ hiện ra trước mắt bạn! 🎉

> **🛑 Cách tắt hệ thống khi không dùng nữa:**
> Trong bảng Terminal của VS Code, bấm tổ hợp phím `Ctrl + C` để dừng, hoặc gõ lệnh:
> ```bash
> docker compose down
> ```

---
---

## 🛠️ CÁCH 2: Cài đặt và Chạy Thủ công (Dành cho nhà phát triển)

Nếu bạn không thể cài đặt Docker hoặc muốn tự tay chạy từng phần (Backend Python + Frontend React + Database PostgreSQL) để dễ lập trình, hãy làm theo tuần tự các bước dưới đây.

### Bước 1: Cài đặt phần mềm nền tảng
1. **Cài đặt Node.js (Để chạy giao diện web React):**
   - Tải bản **LTS (Long Term Support)** tại: 👉 [https://nodejs.org/](https://nodejs.org/)
   - Cài đặt xong, mở Command Prompt (`cmd`) gõ `node -v` kiểm tra phiên bản (từ v18 trở lên là chuẩn).
2. **Cài đặt Python (Để chạy AI và Backend Flask):**
   - Tải Python (khuyên dùng bản 3.10 hoặc 3.11) tại: 👉 [https://www.python.org/downloads/](https://www.python.org/downloads/)
   - **🚨 CỰC KÌ QUAN TRỌNG:** Ở màn hình cài đặt đầu tiên, **BẮT BUỘC phải tích chọn ô "Add Python.exe to PATH"** trước khi bấm *Install Now*.
3. **Cài đặt PostgreSQL (Cơ sở dữ liệu):**
   - Tải và cài đặt PostgreSQL 14+ tại: 👉 [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
   - Khi cài đặt, hãy nhớ mật khẩu bạn đặt cho tài khoản mặc định `postgres`.

---

### Bước 2: Cấu hình Cơ sở dữ liệu PostgreSQL
1. Mở phần mềm quản lý **pgAdmin 4** (đi kèm khi cài PostgreSQL).
2. Tạo một cơ sở dữ liệu mới (Database) đặt tên là: `aqi_vietnam_db`.
3. Mở file cấu hình của Backend tại `backend/config.py` bằng VS Code.
4. Tìm dòng định nghĩa `POSTGRES_URI` (khoảng dòng 3) và sửa lại thành tài khoản/mật khẩu PostgreSQL trên máy của bạn:
   ```python
   # Ví dụ nếu user là postgres và mật khẩu là 123456:
   POSTGRES_URI = "postgresql+psycopg2://postgres:123456@localhost:5432/aqi_vietnam_db"
   ```

---

### Bước 3: Cài đặt & Chạy Backend (AI & API Server)
Mở VS Code, mở **New Terminal** và thực hiện lần lượt các lệnh sau:

1. **Tạo môi trường ảo Python (để không xung đột thư viện):**
   ```powershell
   python -m venv venv
   ```
2. **Kích hoạt môi trường ảo:**
   ```powershell
   .\venv\Scripts\activate
   ```
   *(💡 Nếu PowerShell báo lỗi màu đỏ **ExecutionPolicy**, hãy chạy lệnh `Set-ExecutionPolicy Unrestricted -Scope Process` rồi bấm `Y`, sau đó kích hoạt lại).*
3. **Cài đặt các thư viện AI và Web Server:**
   ```powershell
   pip install -r requirements.txt
   ```
4. **Khởi chạy Backend Server:**
   ```powershell
   python -m backend.app
   ```
   ✅ Nếu thấy thông báo `Running on http://0.0.0.0:5000/` là Backend và mô hình AI đã hoạt động thành công! Hãy **giữ nguyên cửa sổ Terminal này**.

---

### Bước 4: Cài đặt & Chạy Frontend (Giao diện React)
Hãy mở thêm **một bảng Terminal mới thứ 2** trong VS Code (bấm dấu `+` ở góc trên bên phải bảng Terminal) và thực hiện:

1. **Di chuyển vào thư mục frontend:**
   ```powershell
   cd frontend
   ```
2. **Tải các gói thư viện React:**
   ```powershell
   npm install
   ```
3. **Khởi chạy giao diện trang web:**
   ```powershell
   npm run dev
   ```
   ✅ Terminal sẽ hiển thị đường dẫn truy cập (thường là `http://localhost:5173`). Bạn bấm giữ `Ctrl` + Click chuột vào đường dẫn đó để mở trang web lên nhé!

---

## ❓ Câu hỏi thường gặp & Khắc phục lỗi (Troubleshooting)

### 1. Lỗi `docker: 'compose' is not a docker command` hoặc `docker is not recognized...`
👉 **Nguyên nhân:** Bạn chưa cài đặt Docker Desktop hoặc chưa bật phần mềm Docker Desktop lên. Hãy mở phần mềm Docker Desktop từ màn hình Desktop và đợi icon ở góc chóp dưới taskbar xanh lên.

### 2. Lỗi `Port 3000 is already allocated` hoặc `Port 5000 is already allocated`
👉 **Nguyên nhân:** Cổng mạng (Port) trên máy tính của bạn đang bị một ứng dụng khác chiếm dụng (ví dụ Skype, IIS, hoặc một dự án khác đang chạy).
👉 **Khắc phục:** Tắt ứng dụng đang chiếm cổng, hoặc khởi động lại máy tính rồi chạy lại lệnh.

### 3. Trang web hiển thị nhưng không có dữ liệu biểu đồ
👉 **Nguyên nhân:** Hệ thống được thiết lập tự động thu thập dữ liệu mới theo chu kỳ (Scheduler).
👉 **Khắc phục:** Bạn chỉ cần đợi khoảng **1 - 2 phút** sau khi khởi động hệ thống lần đầu tiên, hệ thống sẽ tự động gọi API lấy dữ liệu thời tiết thực tế về và hiển thị đầy đủ trên biểu đồ.

---

Chúc các bạn cài đặt thành công và có những trải nghiệm tuyệt vời với ứng dụng AI bảo vệ môi trường! 🌿🚀 Nếu gặp khó khăn, hãy kiểm tra kỹ lại từng bước phía trên nhé.
