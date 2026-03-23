import express from "express";
const router = express.Router();

import { getAllUsers } from "../../controllers/admin/userController.js";

import { auth, isAdmin } from "../../middlewares/auth.js";

router.get("/users", auth, isAdmin, getAllUsers);

export default router;