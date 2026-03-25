import pool from "../../config/db.js";
import axios from "axios";
 
const sendPushNotification = async (title, message, user_id = null) => {
  try {
    const payload = {
      app_id: process.env.ONESIGNAL_APP_ID,
      headings: { en: title },
      contents: { en: message },
    };
 
    if (user_id) {
      payload.include_external_user_ids = [String(user_id)];
      //  Required when using include_external_user_ids
      // target_channel alone does NOT work with this targeting method
      payload.channel_for_external_user_ids = "push";
    } else {
      payload.included_segments = ["Subscribed Users"];
    }
 
    console.log(" Sending Push Payload:", JSON.stringify(payload, null, 2));
 
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.ONESIGNAL_REST_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
 
    console.log(" OneSignal Response:", response.data);
 
    if (response.data?.recipients === 0) {
      console.warn(
        " 0 recipients — resident needs to log out and back in so OneSignal.login() links their external_id."
      );
    }
 
    return response.data;
 
  } catch (error) {
    console.error("Push error:", error.response?.data || error.message);
  }
};
 
 
// CREATE NOTIFICATION
export const createNotification = async (req, res) => {
  try {
    const { user_id, title, message } = req.body;
 
    if (!title || !message) {
      return res.status(400).json({ success: false, message: "Title and message required" });
    }
 
    // BROADCAST
    if (!user_id) {
      const users = await pool.query("SELECT id FROM users");
      for (const user of users.rows) {
        await pool.query(
          "INSERT INTO notifications(user_id, title, message) VALUES($1, $2, $3)",
          [user.id, title, message]
        );
      }
      await sendPushNotification(title, message);
      return res.status(201).json({ success: true, message: "Notification sent to all users" });
    }
 
    // PERSONAL
    const result = await pool.query(
      "INSERT INTO notifications(user_id, title, message) VALUES($1, $2, $3) RETURNING *",
      [user_id, title, message]
    );
    await sendPushNotification(title, message, user_id);
 
    res.status(201).json({ success: true, message: "Notification sent", data: result.rows[0] });
 
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ success: false, message: "Error sending notification" });
  }
};

// GET ALL NOTIFICATIONS
export const getAllNotifications = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const countResult = await pool.query(`SELECT COUNT(*) FROM notifications`);
    const total = parseInt(countResult.rows[0].count);

    // paginated notifications
    const result = await pool.query(
      `SELECT n.id , n.*, u.name as user_name, u.email 
       FROM notifications n
       JOIN users u ON u.id = n.user_id
       ORDER BY n.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({
      success: true,
      notifications: result.rows,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNotifications: total
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching notifications"
    });
  }
};