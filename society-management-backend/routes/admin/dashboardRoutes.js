import express from "express";
const router = express.Router();

import { getAdminDashboard } from "../../controllers/admin/dashboardController.js";
import { auth, isAdmin } from "../../middlewares/auth.js";

router.get("/dashboard", auth, isAdmin, getAdminDashboard);

export default router;


