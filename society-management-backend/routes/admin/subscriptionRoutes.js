import express from "express";
const router = express.Router();

import {
  getPlans,
  updatePlan
} from "../../controllers/admin/subscriptionController.js";

import { auth, isAdmin } from "../../middlewares/auth.js";


// get all subscription plans
router.get("/subscription-plans", auth, isAdmin, getPlans);


// update subscription plan
router.put("/subscription-plans/:id", auth, isAdmin, updatePlan);
export default router;