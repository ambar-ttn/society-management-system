import pool from "../../config/db.js";

export const adminLogin = async (req, res) => {
  try {

    const email = req.user.email;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND role='admin'",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not an admin.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: result.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};