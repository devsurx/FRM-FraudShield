# 🚨 Fraud Risk Monitoring System (FRM)

A **real-time Fraud Risk Monitoring System** designed to detect, score, and manage suspicious UPI transactions.
This project simulates how modern banks and payment networks monitor fraud activity and assist analysts in decision-making.

---

# 📌 Overview

The FRM system ingests transactions, evaluates them using configurable fraud detection rules, assigns a **risk score (0–100)**, and generates alerts for suspicious activity.
It also provides a frontend dashboard for **monitoring, investigation, and case management**.

---

# 🎯 Key Features

### 🔍 Real-Time Transaction Monitoring

* Ingest and evaluate transactions instantly
* Supports high-frequency transaction flows

### ⚡ Rule-Based Fraud Detection

* Velocity checks (multiple transactions in short time)
* High-value transaction detection
* New payee risk detection

### 📊 Risk Scoring Engine

* Assigns risk score (0–100)
* Categorizes into:

  * LOW RISK
  * MEDIUM RISK
  * HIGH RISK

### 🚨 Alert System

* Automatically flags suspicious transactions
* Filters based on risk levels

### 🗂️ Case Management

* Convert alerts into investigation cases
* Track lifecycle:

  * OPEN
  * INVESTIGATING
  * CLOSED

### 📈 Analytics Dashboard

* Fraud trends
* Risk distribution
* Transaction insights

---

# 🏗️ System Architecture

```
Frontend (React + Tailwind)
        ↓
API Layer (FastAPI)
        ↓
Rule Engine (Python)
        ↓
Database (PostgreSQL)
        ↓
Cache (Redis)
        ↓
Streaming (Kafka - optional)
```

---

# 🧱 Tech Stack

## 🔹 Frontend

* React (Vite)
* Tailwind CSS
* Axios
* Recharts

## 🔹 Backend

* FastAPI (Python)

## 🔹 Database

* PostgreSQL

## 🔹 Caching

* Redis

## 🔹 Streaming (Optional)

* Apache Kafka

## 🔹 Deployment

* Docker (future scope)

---

# 📂 Project Structure

```
frm-system/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── rules.py
│   │   ├── engine.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/frm-system.git
cd frm-system
```

---

## 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

Swagger Docs:

```
http://127.0.0.1:8000/docs
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🧪 Sample Transaction

```json
{
  "user_id": "user123",
  "amount": 60000,
  "timestamp": "2026-04-04T10:00:00",
  "device_id": "deviceA",
  "location": "India",
  "is_new_payee": true
}
```

---

# 🔁 Workflow

1. Transaction is received
2. Fraud rules are applied
3. Risk score is calculated
4. Alert is generated (if needed)
5. Analyst reviews the alert
6. Case is created and investigated

---

# 🚀 Future Enhancements

* Machine Learning fraud detection
* Behavioral analytics
* Device fingerprinting
* Graph/network fraud detection
* Real-time streaming with Kafka
* Role-based authentication (JWT)

---

# ⚠️ Disclaimer

This project is for **educational and demonstration purposes only**.
It simulates fraud detection workflows and should not be used in production without proper security, compliance, and validation.

---

# 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

# 📜 License

This project is licensed under the MIT License.

---

# 💡 Author

Built as a **fintech system design + full-stack project** to demonstrate:

* Real-time systems
* Fraud detection logic
* Scalable architecture
* Full-stack development skills

---
