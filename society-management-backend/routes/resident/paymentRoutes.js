import express from "express";
const router = express.Router();




import { makePayment } from "../../controllers/resident/paymentsController.js";
import { auth } from "../../middlewares/auth.js";


router.post("/payments", auth, makePayment);
export default router;