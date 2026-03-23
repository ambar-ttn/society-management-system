import express from "express";
const router = express.Router();

import { 
  getSubscriptions, 
  getSubscriptionDetails,
  getPendingAmount 
} from "../../controllers/resident/subscriptionController.js";

import { auth, isResident } from "../../middlewares/auth.js";

// All routes are protected
router.get("/subscriptions", auth, isResident, getSubscriptions);
router.get("/subscriptions/details", auth, isResident, getSubscriptionDetails);
router.get("/subscriptions/pending", auth, isResident, getPendingAmount);



export default router;