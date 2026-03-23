import express from "express";
const router = express.Router();

import { auth, isResident } from "../../middlewares/auth.js";
import { getMyFlats } from "../../controllers/resident/residentFlatsController.js";

router.get("/flats", auth, isResident, getMyFlats);



export default router;