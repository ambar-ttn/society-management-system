import express from "express";
const router = express.Router();

import { adminLogin } from "../../controllers/admin/adminController.js";
import { verifyAuth } from "../../middlewares/verifyAuth.js";

router.post("/login", verifyAuth, adminLogin);

export default router;