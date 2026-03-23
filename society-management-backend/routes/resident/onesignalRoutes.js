import express from "express";
const router = express.Router();
import { auth } from "../../middlewares/auth.js";
import pool from "../../config/db.js";

// Save OneSignal ID - Logged in user ka apna ID save karega
router.post("/save-onesignal-id", auth, async (req, res) => {
  try {
    const { onesignal_id } = req.body;
    const user_id = req.user.id; // Auth middleware se mil raha hai

    if (!onesignal_id) {
      return res.status(400).json({ 
        success: false, 
        message: "OneSignal ID required" 
      });
    }

    await pool.query(
      "UPDATE users SET onesignal_id = $1 WHERE id = $2",
      [onesignal_id, user_id]
    );

    res.json({ 
      success: true, 
      message: "OneSignal ID saved successfully" 
    });

  } catch (error) {
    console.error("Error saving OneSignal ID:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

export default router;