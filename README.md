# Billiard Manager - Hệ Thống Quản Lý Quán Bida

## Giới Thiệu Đề Tài

**Billiard Manager** là một ứng dụng web được thiết kế để hỗ trợ quản lý các hoạt động trong một quán bida, từ việc theo dõi trạng thái bàn, quản lý doanh thu, đến xử lý thanh toán và báo cáo. Dự án được phát triển nhằm tối ưu hóa quy trình vận hành cho các chủ quán bida, đặc biệt trong các quán có quy mô vừa và nhỏ. Ứng dụng tập trung vào:

- **Quản lý bàn**: Theo dõi trạng thái (trống, đang dùng, đã đặt), thời gian sử dụng, và doanh thu theo từng bàn.
- **Thống kê và báo cáo**: Cung cấp cái nhìn tổng quan về doanh thu, lợi nhuận, và lượng khách hàng.
- **Trải nghiệm người dùng**: Giao diện trực quan, thân thiện với thiết bị di động, và tích hợp các hiệu ứng mượt mà (sử dụng GSAP).
- **Tính bảo trì**: Áp dụng kiến trúc Clean Code, SOLID, và tách biệt logic (frontend/backend).

Dự án được xây dựng với công nghệ hiện đại như **Next.js**, **React**, **Node.js**, **Express**, **PostgreSQL**, và **TailwindCSS**, hướng đến việc mở rộng thành một nền tảng SaaS trong tương lai.

---

## Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống

- Node.js (v18.x hoặc cao hơn)
- npm hoặc yarn
- PostgreSQL (đã cài đặt và chạy)
- Git (để clone repository)

### Cấu Trúc Dự Án

- `client/`: Chứa mã nguồn frontend (Next.js).
- `server/`: Chứa mã nguồn backend (Node.js/Express).

---

### Cài Đặt Client (Frontend)

1. **Chuyển đến thư mục client**:

   ```bash
   cd client
   ```

2. **Cài đặt các dependencies**:

   ```bash
   npm install
   ```

   - Các thư viện chính: `react`, `next`, `lucide-react`, `gsap`, `tailwindcss`.

3. **Cấu hình biến môi trường**:

   - Tạo file `.env.local` trong thư mục `client` với nội dung:

     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```
   - Đảm bảo URL khớp với server (xem phần cài đặt server).

4. **Chạy ứng dụng ở chế độ phát triển**:

   ```bash
   npm run dev
   ```

   - Mở trình duyệt tại `http://localhost:3000` để xem giao diện.

---

### Cài Đặt Server (Backend)

1. **Chuyển đến thư mục server**:

   ```bash
   cd server
   ```

2. **Cài đặt các dependencies**:

   ```bash
   npm install
   ```

   - Các thư viện chính: `express`, `pg` (PostgreSQL), `jsonwebtoken`, `cors`.

3. **Cấu hình biến môi trường**:

   - Tạo file `.env` trong thư mục `server` với nội dung:

     ```
     DB_HOST=localhost
     DB_USER=postgres
     DB_PASSWORD=123456  
     DB_NAME=billiard_manager
     DB_PORT=5432
     PORT=5000
     JWT_SECRET=9UT/fU9kDm0yHNCtq1QgJijXR/3x1Di+fZfhNwKS87I
     ```
   - Thay `your_postgres_user`, `your_postgres_password`, và `your_jwt_secret_key` bằng giá trị thực tế.
   - Tạo database `billiard_manager` trong PostgreSQL:

     ```sql
     CREATE DATABASE billiard_manager;
     CREATE TABLE tables (
       id SERIAL PRIMARY KEY,
       status VARCHAR(20) NOT NULL,
       usage_time DECIMAL DEFAULT 0,
       revenue DECIMAL DEFAULT 0
     );
     ```

4. **Chạy server**:

   ```bash
   npm start
   ```

   - Server sẽ chạy tại `http://localhost:5000`.

---

### Chạy Đồng Thời Client và Server

- Mở hai terminal:
  - Terminal 1: Chạy server (`cd server && npm start`).
  - Terminal 2: Chạy client (`cd client && npm run dev`).
- Truy cập `http://localhost:3000` để sử dụng ứng dụng.

---

### Hướng Dẫn Sử Dụng

1. **Quản lý bàn**: Click vào bất kỳ bàn nào để xem chi tiết, thay đổi trạng thái (trống/đang dùng), hoặc thanh toán.
2. **Tìm kiếm**: Sử dụng thanh tìm kiếm để lọc bàn theo ID.
3. **Thanh toán**: Click "Thanh toán" để mở khung xác nhận và hoàn tất.

---

### Cảm Ơn

Cảm ơn bạn đã quan tâm đến **Billiard Manager**! Nếu có bất kỳ câu hỏi nào, hãy liên hệ hoặc để lại phản hồi.