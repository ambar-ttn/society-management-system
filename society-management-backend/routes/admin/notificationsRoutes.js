import express from "express";
const router = express.Router();
import {
 createNotification,
 getAllNotifications
} from "../../controllers/admin/notificationsController.js";

import { auth, isAdmin } from "../../middlewares/auth.js";

router.post("/notifications", auth, isAdmin, createNotification);
router.get("/notifications", auth, isAdmin, getAllNotifications);

export default router;