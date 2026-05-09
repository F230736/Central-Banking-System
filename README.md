# 🏦 Central Banking System (CBS)

A full-stack MERN banking web application that simulates modern digital banking operations with secure authentication, transaction management, beneficiary handling, notifications, analytics, and admin controls.

---

# 📌 Features

## 👤 User Features

* User Registration & Login
* JWT Authentication
* Role-Based Access Control (RBAC)
* Account Creation
* Account Overview Dashboard
* Money Transfer System
* Transaction History
* Search Transactions
* Beneficiary Management
* Quick Transfer Feature
* Notifications System
* Profile Page
* Password Update / Security Settings
* Banking Card UI
* Responsive Banking Interface

---

## 🛡️ Admin Features

* Admin Dashboard
* View Total Users
* View Total Transactions
* View Audit Logs
* View Total Money Transferred
* User Monitoring
* Transaction Monitoring
* Audit Log Monitoring

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Axios
* CSS

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication & Security

* JWT (JSON Web Tokens)
* bcryptjs
* Middleware Protection

---

# 📂 Project Structure

```bash
CBS_Project
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_LINK>
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside backend folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# ▶️ Run Backend

```bash
cd backend
npm run server
```

OR

```bash
nodemon server.js
```

---

# ▶️ Run Frontend

```bash
cd frontend
npm start
```

---

# 🔐 Authentication

The application uses:

* JWT Token Authentication
* Protected Routes
* Admin Middleware
* Password Hashing using bcryptjs

---

# 💳 Banking Features

## Account System

Each newly registered user automatically receives:

* Unique Bank Account
* Account Number
* Initial Balance

---

## Transaction System

Users can:

* Send Money
* View Transaction History
* Search Transactions
* Perform Quick Transfers

MongoDB Transactions are used to maintain:

* Atomicity
* Data Consistency
* Secure Transfers

---

## Beneficiary System

Users can:

* Save Beneficiaries
* Remove Beneficiaries
* Use Quick Transfer

---

## Notifications System

Users receive notifications for:

* Successful Transfers
* Banking Activities
* Account Actions

---

# 📊 Analytics Dashboard

Admin can monitor:

* Total Users
* Total Transactions
* Total Audit Logs
* Total Money Transferred

---

# 🧠 Learning Outcomes

This project demonstrates:

* Full Stack MERN Development
* REST API Development
* Authentication & Authorization
* MongoDB Transactions
* Frontend State Management
* React Components & Routing
* Secure Banking Workflows
* Git & GitHub Version Control

---

# 🚀 Future Improvements

Possible future enhancements:

* OTP Verification
* Email Notifications
* Real-Time Transfers
* Charts & Graph Analytics
* Scheduled Payments
* Mobile Responsive UI Enhancements
* Dark/Light Theme Toggle
* AI Fraud Detection

---

# 👨‍💻 Author

Developed as a Web Programming MERN Stack Project.

---

# 📜 License

This project is for educational purposes only.
