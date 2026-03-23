import "dotenv/config";
import express from "express";
console.log("ENV URL:", process.env.DB_URL);
import cors from "cors"; // (cross origin resource sharing --> for sending the cookies or tokens between different domains (as backend and frontend are running on differnt ports ) )

import flatRoutes from './routes/admin/flatsRoutes.js';
import subscriptionRoutes from "./routes/admin/subscriptionRoutes.js";
import monthlyRoutes from "./routes/admin/monthlyRecordsRoutes.js";
import paymentsRoutes from "./routes/admin/paymentsRoutes.js";
import notificationRoutes from "./routes/admin/notificationsRoutes.js";
import reportsRoutes from "./routes/admin/reportsRoutes.js";
import adminDashboardRoute from "./routes/admin/dashboardRoutes.js";
import loginRoute from "./routes/admin/login.js";
import userRoutes from "./routes/admin/userRoutes.js";

import user from './routes/user.js';
import payment from "./routes/resident/paymentRoutes.js";
import dashboardRoute from "./routes/resident/dashboardRoute.js";
import subscriptionRoutesR from "./routes/resident/subscriptionRoutes.js";
import myFlatsRoute from "./routes/resident/myFlatsRoute.js";
import residentOneSignalRoutes from "./routes/resident/onesignalRoutes.js";

import profileRoutes from "./routes/profile.js";
import "./jobs/generateMonthlyRecords.js";

import pool from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// Routes for the admin only
app.use("/api/v1/admin", flatRoutes);
app.use("/api/v1/admin", subscriptionRoutes);
app.use("/api/v1/admin", monthlyRoutes);
app.use("/api/v1/admin", paymentsRoutes);
app.use("/api/v1/admin", notificationRoutes);
app.use("/api/v1/admin", reportsRoutes);
app.use("/api/v1/admin", adminDashboardRoute);
app.use("/api/v1/admin", loginRoute);
app.use("/api/v1/admin", userRoutes);

// Routes related to user (resident)
app.use("/api/v1/resident", dashboardRoute);
app.use("/api/v1/resident", subscriptionRoutesR);
app.use("/api/v1/resident", payment);
app.use("/api/v1/resident", myFlatsRoute);
// Use karo - /api/resident ke under
app.use("/api/v1/resident", residentOneSignalRoutes);

// Some common used routes 
app.use("/api/v1", profileRoutes);
app.use("/api/v1", user);

// to check the db connection by starting a random simple query ..
pool.query("SELECT 1")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.get("/", (req, res) => {
  res.send("Server is running");
});

console.log(process.env.DB_URL);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});