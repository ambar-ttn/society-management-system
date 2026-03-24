# Society Management System

A full stack web application for managing society residents, flats, maintenance records, payments, subscriptions, and notifications.  
The system provides separate dashboards for Admin and Residents with role-based authentication.

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- Axios
- Recharts
- Lucide React 
- React Hot Toast
- OneSignal Push Notifications

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Bcrypt Password Hashing
- node-cron
- PDFKit
- json2csv

---

## Features

### Admin
- Admin Authentication
- Dashboard Analytics
- Flat Management
- Monthly Maintenance Records
- Payment Entry
- Notifications to Residents
- Reports (PDF / CSV)
- Subscription Plans Management

### Resident
- Resident Login / Signup
- Dashboard
- View Monthly Maintenance
- Payment History
- Notifications
- Subscription History
- Profile Management


## Database (PostgreSQL Tables)

- users
- profiles
- flats
- payments
- monthly_records
- notifications
- subscription_plans

---

## Run Project Locally

### 1. Clone Repository

git clone https://github.com/ambar-ttn/society-management-system.git


### 2. Backend Setup

cd backend
npm install
npm run dev


### 3. Frontend Setup

cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:3001


Backend runs on:

http://localhost:3000


---

## Environment Variables

### Backend (.env)

PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=society_db
DB_PASSWORD=1234
DB_PORT=5432
JWT_SECRET=mysecret

ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_REST_KEY=your_onesignal_rest_key

DB_URL=your_postgres_connection_url
GOOGLE_CLIENT_ID=your_google_client_id


### Frontend (.env.local)

NEXT_PUBLIC_API_URL=http://localhost:3000

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_app_id


---

## Authentication

The system uses:
- JWT Token Authentication
- Role Based Access (Admin / Resident)
- Google Login (OAuth)
- OneSignal Push Notifications

---

## Author
**Ambar To The New**
