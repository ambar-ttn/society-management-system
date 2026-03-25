import express from "express";
const router = express.Router();

import { auth } from "../middlewares/auth.js";

import {
 getProfile,
 updateProfile,
 
} from "../controllers/profileController.js";


// only for a valid user of my website not everyone is allowed to do so ..

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

export default router;