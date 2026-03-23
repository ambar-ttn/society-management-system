import express from "express";
const router = express.Router();

import {
 getMonthlyRecords,
 updateMonthlyRecord
} from "../../controllers/admin/monthlyRecordsController.js";

import { auth, isAdmin } from "../../middlewares/auth.js";


router.get("/monthly-records", auth, isAdmin, getMonthlyRecords);
router.put("/monthly-records/:id", auth, isAdmin, updateMonthlyRecord);



export default router;