import authService from "../services/authService.js";
import userService from "../services/userService.js";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }
// bcrypt.compare(plainPassword, hashedPassword)
/*
“bcrypt is used because it is slow and includes built-in salting, making it secure against brute-force attacks.”
“Alternatives like Argon2 and scrypt are also used, as they provide strong resistance to modern attacks.”

*/
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    // Check if user exists
    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Create new user
    const newUser = await authService.createUser({
      name,
      email,
      password,
      role: "resident" // signup for resident only
    });

    // Create user profile
    await authService.createUserProfile(newUser.id);

    // Prepare response
    const userResponse = authService.prepareUserResponse(newUser);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: userResponse
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Signup failed"
    });
  }
};

// LOGIN (EMAIL + PASSWORD)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    // Find user
    const user = await authService.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Use Google login for this account"
      });
    }

    // Verify password
    const match = await authService.verifyPassword(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = authService.generateToken(user);

    // Prepare response
    const userResponse = authService.prepareUserResponse(user);

    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login error"
    });
  }
};

// Google auth
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

    const payload = await ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    let user = await authService.findUserByEmail(email);

if (!user) {
  return res.status(403).json({
    success: false,
    message: "You are not authorized by the system"
  });
    }

    const jwtToken = authService.generateToken(user);

    const userResponse = authService.prepareUserResponse(user);

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: userResponse
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed"
    });
  }
};



export const updateOneSignalId = async (req, res) => {
  try {
    const { onesignal_id } = req.body;
    const userId = req.user.id;

    if (!onesignal_id) {
      return res.status(400).json({
        success: false,
        message: "OneSignal ID is required"
      });
    }

    await pool.query(
      `UPDATE users SET onesignal_id = $1 WHERE id = $2`,
      [onesignal_id, userId]
    );

    console.log(` OneSignal ID saved for user ${userId}: ${onesignal_id}`);

    res.status(200).json({
      success: true,
      message: "OneSignal ID updated successfully"
    });

  } catch (error) {
    console.error("OneSignal update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update OneSignal ID"
    });
  }
};