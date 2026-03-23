import express from "express";
const router = express.Router();

import { getReport } from "../../controllers/admin/reportsController.js";

import { auth, isAdmin } from "../../middlewares/auth.js";

router.get("/reports", auth, isAdmin, getReport);

export default router;