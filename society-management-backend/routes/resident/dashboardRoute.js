import express from "express";
const router = express.Router();


import { getDashboard } from "../../controllers/resident/dashboardController.js";
import { auth, isResident } from "../../middlewares/auth.js";


router.get("/dashboard", auth, isResident, getDashboard); // simple as it can only be for resident no one should be allowed to access it . 
export default router;