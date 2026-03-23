import express from "express";
const router = express.Router();
import {
 createPayment,
 getPayments
} from "../../controllers/admin/paymentsController.js";

import { auth, isAdmin } from "../../middlewares/auth.js";

router.post("/payments", auth, isAdmin, createPayment);
router.get("/payments", auth, isAdmin, getPayments);

export default router;