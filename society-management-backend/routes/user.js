import express from "express";
const router = express.Router();

import { signup, login, googleAuth, updateOneSignalId } from "../controllers/authController.js";
import { auth} from "../middlewares/auth.js";

router.post('/signup', signup);
router.post('/login', login);
router.post("/google", googleAuth);
router.post("/auth/update-onesignal-id", auth, updateOneSignalId);

export default router;





