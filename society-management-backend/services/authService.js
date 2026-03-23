import bcrypt from "bcrypt";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import "dotenv/config";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authService = {
    // Check if user exists by email
    findUserByEmail: async (email) => {
        const result = await pool.query(
            "SELECT id, name, email, password, role, onesignal_id FROM users WHERE email=$1",
            [email.toLowerCase()]
        );
        return result.rows[0];
    },

    // Create new user
    createUser: async (userData) => {
        const { name, email, password, role = "resident" } = userData;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        
        const result = await pool.query(
            `INSERT INTO users(name, email, password, role, created_at)
             VALUES($1, $2, $3, $4, $5)
             RETURNING id, name, email, role, onesignal_id`,
            [name, email.toLowerCase(), hashedPassword, role, new Date()]
        );
        
        return result.rows[0];
    },

    // Create user profile
    createUserProfile: async (userId) => {
        await pool.query(
            `INSERT INTO profiles(user_id) VALUES($1)`,
            [userId]
        );
    },

    // Verify password
    verifyPassword: async (plainPassword, hashedPassword) => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    // Generate JWT token
    generateToken: (user) => {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "10h"
        });
    },

    // Verify Google token
    verifyGoogleToken: async (token) => {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        return ticket.getPayload();
    },

    // Prepare user response (remove password, add flags)
    prepareUserResponse: (user) => {
        const userResponse = { ...user };
        delete userResponse.password;
        userResponse.needs_onesignal = !userResponse.onesignal_id;
        return userResponse;
    },

    // Update OneSignal ID (if you need this functionality)
    updateOneSignalId: async (userId, onesignalId) => {
        await pool.query(
            "UPDATE users SET onesignal_id = $1 WHERE id = $2",
            [onesignalId, userId]
        );
    }
};

export default authService;