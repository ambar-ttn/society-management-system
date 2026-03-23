import pool from "../../config/db.js";
import userService from "../../services/userService.js";

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {

    const users = await userService.getAllUsers();

    return res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });

  } catch (error) {

    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching users"
    });

  }
};