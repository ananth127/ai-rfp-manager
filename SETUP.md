# Project Setup Guide

This repository contains two implementations of the AI-Powered RFP Management System:

1.  **`/rfp-next` (Recommended)**: A unified, modern Full-Stack application using Next.js 14 and TypeScript.
2.  **`/backend` & `/frontend`**: A separated Express.js (backend) and React/Vite (frontend) implementation.

---

## Option 1: Next.js + TypeScript (Recommended)

This version allows you to run both the frontend and backend in a single process.

### 1. Prerequisites
-   Node.js (v18 or higher)
-   MongoDB (Running locally on default port 27017 or a cloud URI)

### 2. Configuration
Navigate to the `rfp-next` directory and setup environment variables:

```bash
cd rfp-next
```

Create a file named `.env.local` in this directory. Copy the following content into it:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/rfp_system_next

# OpenAI API (Required for Parsing)
OPENAI_API_KEY=sk-YOUR_OPENAI_KEY_HERE

# Email Configuration (Gmail Example)
# 1. Enable 2-Step Verification in Google Account
# 2. Generate an "App Password" (search for it in Google Account settings)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_HOST=smtp.gmail.com
```

### 3. Installation
Install the dependencies:

```bash
npm install
```

### 4. Running the App
Start the development server:

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## Option 2: Separate Backend/Frontend

Use this if you prefer a traditional decoupled architecture.

### Backend Setup

1.  Navigate to `backend`:
    ```bash
    cd backend
    ```
2.  Create `.env`:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/rfp_system
    OPENAI_API_KEY=sk-...
    EMAIL_USER=...
    EMAIL_PASS=...
    ```
3.  Install and Run:
    ```bash
    npm install
    npm start
    ```

### Frontend Setup

1.  Open a new terminal and navigate to `frontend`:
    ```bash
    cd frontend
    ```
2.  Install and Run:
    ```bash
    npm install
    npm run dev
    ```
3.  Open browser to **http://localhost:5173**

---

## Troubleshooting

-   **MongoDB Connection Error**: Ensure your local MongoDB service is running (`mongod`).
-   **Email Failed**: Ensure you are using an **App Password** for Gmail, not your login password.
-   **AI Parsing Failed**: Check your `OPENAI_API_KEY` credits/validity.
