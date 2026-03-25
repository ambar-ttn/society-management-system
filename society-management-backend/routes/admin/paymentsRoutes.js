import express from "express";
const router = express.Router();
import {
 createPayment,
} from "../../controllers/admin/paymentsController.js";

import { auth, isAdmin } from "../../middlewares/auth.js";

router.post("/payments", auth, isAdmin, createPayment);

export default router;