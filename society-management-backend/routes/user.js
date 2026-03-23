import express from "express";
const router = express.Router();

import { signup, login, logout, googleAuth, updateOneSignalId } from "../controllers/authController.js";
import { auth, isAdmin, isResident } from "../middlewares/auth.js";

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post("/google", googleAuth);
router.post("/auth/update-onesignal-id", auth, updateOneSignalId);

export default router;


/*        
Object kuch aisa hai internally:
{
  signup: signup,
  login: login,
  logout: logout,
  googleAuth: googleAuth
}
*/



