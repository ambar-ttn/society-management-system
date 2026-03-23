import pool from "../config/db.js";
import bcrypt from "bcrypt";

const profileService = {
    getProfileByUserId: async (userId) => {
        const result = await pool.query(
            `SELECT gender, date_of_birth, about, contact_number
             FROM profiles
             WHERE user_id=$1 ORDER BY id desc limit 1`,
            [userId]
        );
        return result.rows[0];
    },

    checkProfileExists: async (userId) => {
        const result = await pool.query(
            "SELECT user_id FROM profiles WHERE user_id=$1",
            [userId]
        );
        return result.rows.length > 0;
    },

    updateProfile: async (userId, profileData) => {
        const { gender, date_of_birth, about, contact_number } = profileData;
        
        const result = await pool.query(
            `UPDATE profiles
             SET gender=$1,
                 date_of_birth=$2,
                 about=$3,
                 contact_number=$4
             WHERE user_id=$5
             RETURNING gender, date_of_birth, about, contact_number`,
            [gender, date_of_birth, about, contact_number, userId]
        );
        
        return result.rows[0];
    },

    updateUserPassword: async (userId, hashedPassword) => {
        await pool.query(
            "UPDATE users SET password=$1 WHERE id=$2",
            [hashedPassword, userId]
        );
    },

    deleteProfileByUserId: async (userId) => {
        const result = await pool.query(
            "DELETE FROM profiles WHERE user_id=$1 RETURNING user_id",
            [userId]
        );
        return result.rows[0];
    },

    validatePassword: (password, confirmPassword) => {
        if (!password || !confirmPassword) {
            return {
                isValid: false,
                message: "Both password and confirmPassword are required and shoulnot be null"
            };
        }

        if (password !== confirmPassword) {
            return {
                isValid: false,
                message: "Passwords do not match"
            };
        }

        if (password.length < 6) {
            return {
                isValid: false,
                message: "Password must be at least 6 characters"
            };
        }

        return { isValid: true };
    },

    hashPassword: async (password) => {
        return await bcrypt.hash(password, 10);
    }
};

export default profileService;