# 🚀 Attendance App

Welcome to the **Attendance App**—your modern solution for seamless attendance tracking and management! Designed for educational institutions and organizations, this app empowers faculty and students with smart features, cutting-edge technology, and a user-friendly interface.

---

## 🌟 Highlights

### 📝 Multiple Attendance Systems:
- **Manual:** Quick and easy manual attendance marking.
- **OTP-Based:** Secure attendance via unique OTPs sent to students.
- **QR Code:** Scan to mark attendance instantly.
- **BSSID-Based:** Leverages ESP32 to scan classroom Wi-Fi, capturing SSID and BSSID data, and sending it to the faculty via a socket server.

### 📍 Location Integration:
- **GPS-Based Tracking:** Verify attendance with precise location data.

### 📊 Attendance Reports:
- Faculty can effortlessly generate detailed attendance reports for record-keeping and analysis.

### 🔒 Robust Security:
- **JWT Authentication:** Ensures secure login for all users.
- **Google OAuth:** Convenient and safe login using Google accounts.

### 👩‍🎓 Student Features:
- Real-time attendance tracking for current subjects.
- Unique student verification system. only verified students can mark attendance.
- Students can send verification requests directly to faculty.

---

## 🛠️ Built With

- **Frontend:** [Next.js](https://nextjs.org/) and [Mantine UI](https://mantine.dev/)
- **Backend:** Node.js with socket servers
- **Database:** MongoDB
- **Authentication:** Google OAuth and JWT
- **Hardware Integration:** ESP32 for Wi-Fi-based attendance

---

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MalavMori/attendanceapp.git
