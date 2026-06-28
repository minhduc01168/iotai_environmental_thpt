# 🍏 Hướng dẫn Cài đặt & Chạy Dự án trên macOS (MacBook / iMac)

Chào mừng bạn đến với dự án **Hệ thống Giám sát & Cảnh báo Chất lượng Không khí AI (AQI)**! 🌍🤖

Tài liệu này được thiết kế dành riêng cho người dùng sử dụng máy tính **macOS (MacBook Air, MacBook Pro, iMac...)**, hướng dẫn chi tiết từng bước theo phong cách **"Đơn giản - Dễ hiểu - Ai cũng làm được"**.

---

## 📌 Lưu ý trước khi bắt đầu: Kiểm tra dòng chip máy Mac của bạn

Apple hiện có 2 dòng chip trên máy Mac. Hãy bấm vào biểu tượng **Quả táo ** ở góc trên cùng bên trái màn hình ➔ Chọn **Giới thiệu về máy Mac này (About This Mac)** để xem máy của bạn dùng chip gì nhé:
- **Chip Apple (M1, M2, M3, M4...):** Sẽ hiển thị chữ *Apple M1 / M2 / M3...*
- **Chip Intel:** Sẽ hiển thị chữ *Intel Core i5 / i7 / i9...*

Việc biết dòng chip sẽ giúp bạn tải đúng bộ cài đặt ở phần dưới.

---

## 📌 Bạn nên chọn cách cài đặt nào?

| Phương thức | Độ khó | Thời gian chuẩn bị | Ưu điểm nổi bật |
| :--- | :---: | :---: | :--- |
| **🌟 Cách 1: Dùng Docker Desktop**<br>*(Khuyên dùng cho người mới)* | 🟢 **Rất dễ** | ~10 - 15 phút | • Chỉ cần chạy **1 câu lệnh duy nhất**.<br>• Tự động cài đặt đầy đủ AI, Database, Web.<br>• Hoạt động cực kỳ mượt mà trên macOS. |
| **🛠️ Cách 2: Cài đặt thủ công (Homebrew)**<br>*(Dành cho nhà phát triển)* | 🟡 **Trung bình** | ~20 - 30 phút | • Sử dụng Homebrew chuẩn bài lập trình viên macOS.<br>• Dễ dàng chỉnh sửa code và xem thay đổi ngay. |

---

## 🌟 CÁCH 1: Cài đặt Tự động bằng Docker Desktop (Khuyên dùng)

### Bước 1: Tải và cài đặt phần mềm
1. **Tải Visual Studio Code (VS Code):**
   - Truy cập: 👉 [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Tải bản dành cho Mac, sau đó kéo thả biểu tượng VS Code vào thư mục **Applications (Ứng dụng)**.
2. **Tải Docker Desktop cho Mac:**
   - Truy cập: 👉 [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
   - **⚠️ Hãy chọn đúng nút tải:**
     - Nếu máy dùng chip M1/M2/M3/M4: Chọn nút **"Download for Mac - Apple Silicon"**.
     - Nếu máy dùng chip Intel: Chọn nút **"Download for Mac - Intel Chip"**.
   - Mở file `.dmg` vừa tải về và kéo thả icon cá voi vào thư mục **Applications**.
3. **Khởi động Docker Desktop:**
   - Mở thư mục Applications, double-click vào phần mềm **Docker**. *(Nếu Mac hỏi có cho phép mở ứng dụng tải từ internet không, hãy chọn "Open" hoặc "Cho phép")*.
   - Đợi icon chú cá voi trên thanh menu phía trên màn hình hiển thị trạng thái **"Engine running"** màu xanh lá.

---

### Bước 2: Mở dự án trong Terminal
1. Mở thư mục chứa dự án `iotai_environmental_thpt`.
2. Kéo thả cả thư mục dự án vào biểu tượng phần mềm **VS Code** dưới thanh Dock để mở.
3. Trong VS Code, nhìn lên menu phía trên màn hình chọn **Terminal** ➔ **New Terminal** (hoặc bấm tổ hợp phím `Cmd + ~` hoặc `Ctrl + ~`). Một bảng nhập lệnh sẽ hiện ra ở phía dưới.

---

### Bước 3: Khởi chạy hệ thống chỉ với 1 lệnh
Tại bảng Terminal vừa mở, copy và dán câu lệnh sau rồi nhấn `Enter`:

```bash
docker compose up --build
```

⏳ **Hệ thống sẽ tự động build và cài đặt:**
- Ở lần đầu tiên, máy sẽ mất khoảng **3 - 5 phút** để tải môi trường Python, Node.js và cơ sở dữ liệu về máy.
- Khi xuất hiện các dòng thông báo dịch vụ đã `Started` hoặc Nginx báo `listening on http://0.0.0.0:80`, hệ thống đã khởi chạy thành công!

---

### Bước 4: Trải nghiệm ứng dụng
- Mở trình duyệt web (Safari, Chrome, Arc...), truy cập vào đường dẫn:
  👉 **http://localhost:3000**
- Giao diện giám sát chất lượng không khí AI sẽ xuất hiện! 🎉

> **🛑 Cách tắt hệ thống khi không dùng:**
> Trong bảng Terminal của VS Code, bấm tổ hợp phím `Control + C` để dừng, hoặc gõ lệnh:
> ```bash
> docker compose down
> ```

---
---

## 🛠️ CÁCH 2: Cài đặt Thủ công qua Homebrew (Dành cho nhà phát triển)

macOS là môi trường tuyệt vời cho lập trình viên. Chúng ta sẽ sử dụng công cụ **Homebrew** để cài đặt mọi thứ chỉ với vài câu lệnh.

### Bước 1: Cài đặt Homebrew và các phần mềm nền tảng
Mở ứng dụng **Terminal** mặc định của macOS (nhấn `Cmd + Space` gõ `Terminal` rồi Enter) và chạy lần lượt:

1. **Cài đặt công cụ Xcode Command Line Tools (nếu chưa có):**
   ```bash
   xcode-select --install
   ```
   *(Bấm Install và đợi macOS cài đặt xong).*
2. **Cài đặt Homebrew (công cụ quản lý gói số 1 trên Mac):**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. **Cài đặt Node.js, Python 3.11 và PostgreSQL qua Homebrew:**
   ```bash
   brew install node python@3.11 postgresql@14
   ```

---

### Bước 2: Khởi động & Cấu hình PostgreSQL
1. **Bật dịch vụ PostgreSQL chạy ngầm:**
   ```bash
   brew services start postgresql@14
   ```
2. **Tạo cơ sở dữ liệu cho dự án:**
   ```bash
   createdb aqi_vietnam_db
   ```
3. Mở file cấu hình `backend/config.py` trong VS Code, sửa lại dòng connection string `POSTGRES_URI` (khoảng dòng 3) để kết nối vào database trên máy Mac của bạn:
   ```python
   # Trên Mac cài qua Homebrew, user thường chính là tên tài khoản Mac của bạn và không cần mật khẩu:
   POSTGRES_URI = "postgresql+psycopg2://localhost:5432/aqi_vietnam_db"
   ```

---

### Bước 3: Cài đặt & Khởi chạy Backend (AI & Flask Server)
Mở VS Code, mở **New Terminal** tại thư mục dự án và thực hiện:

1. **Tạo môi trường ảo Python:**
   ```bash
   python3 -m venv venv
   ```
2. **Kích hoạt môi trường ảo:**
   ```bash
   source venv/bin/activate
   ```
3. **Cài đặt các thư viện AI & Web:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Khởi chạy Backend Server:**
   ```bash
   python3 -m backend.app
   ```
   ✅ Nếu thấy dòng báo `Running on http://0.0.0.0:5000/` là Backend và AI đã sẵn sàng! Hãy **giữ nguyên tab Terminal này**.

---

### Bước 4: Cài đặt & Khởi chạy Frontend (React)
Bấm nút `+` ở góc trên bên phải bảng Terminal của VS Code để mở thêm **một tab Terminal thứ 2**, sau đó chạy:

1. **Di chuyển vào thư mục frontend:**
   ```bash
   cd frontend
   ```
2. **Cài đặt các gói thư viện React:**
   ```bash
   npm install
   ```
3. **Khởi chạy server giao diện:**
   ```bash
   npm run dev
   ```
   ✅ Bấm giữ phím `Cmd` (Command) + Click chuột vào đường dẫn hiển thị trên Terminal (thường là 👉 `http://localhost:5173`) để mở trang web lên nhé!

---

## ❓ Câu hỏi thường gặp & Khắc phục lỗi trên macOS

### 1. Lỗi `command not found: python` hoặc `command not found: pip`
👉 **Nguyên nhân:** Trên macOS, lệnh Python được đặt tên mặc định là `python3` và `pip3`.
👉 **Khắc phục:** Bạn hãy luôn dùng `python3` thay cho `python` và `pip3` thay cho `pip` nhé.

### 2. Lỗi `port is already allocated` (Cổng 3000 hoặc 5000 bị chiếm dụng)
👉 **Nguyên nhân:** Có thể tính năng AirPlay Receiver của macOS đang chiếm dụng cổng 5000, hoặc một ứng dụng web khác đang chạy.
👉 **Khắc phục:** Vào **Cài đặt hệ thống (System Settings)** ➔ **Cài đặt chung (General)** ➔ **AirDrop & Handoff** ➔ Tắt mục **Bộ thu AirPlay (AirPlay Receiver)**. Hoặc đổi cổng chạy trong code.

### 3. Lỗi `xcrun: error: invalid active developer path` khi gõ lệnh git hoặc brew
👉 **Nguyên nhân:** Bạn vừa nâng cấp phiên bản macOS mới khiến bộ công cụ lập trình Xcode bị mất liên kết.
👉 **Khắc phục:** Mở Terminal và gõ lại lệnh: `xcode-select --install` là xong!

---

Chúc bạn có những trải nghiệm tuyệt vời và mượt mà trên chiếc máy Mac của mình! 🍏🚀 Nếu cần hỗ trợ thêm, hãy kiểm tra lại từng bước phía trên nhé.
