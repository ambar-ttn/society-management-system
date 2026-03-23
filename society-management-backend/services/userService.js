import pool from "../config/db.js";

const userService = {
    // Get user by ID
    getUserById: async (userId) => {
        const result = await pool.query(
            "SELECT id, name, email, role, onesignal_id, created_at FROM users WHERE id = $1",
            [userId]
        );
        return result.rows[0];
    },

    // Update user
    updateUser: async (userId, updateData) => {
        const { name, email, role } = updateData;
        const result = await pool.query(
            `UPDATE users 
             SET name = COALESCE($1, name),
                 email = COALESCE($2, email),
                 role = COALESCE($3, role)
             WHERE id = $4
             RETURNING id, name, email, role, onesignal_id`,
            [name, email, role, userId]
        );
        return result.rows[0];
    },

    // Delete user
    deleteUser: async (userId) => {
        // First delete profile (due to foreign key)
        await pool.query("DELETE FROM profiles WHERE user_id = $1", [userId]);
        // Then delete user
        await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    },

    // Get user profile
    getUserProfile: async (userId) => {
        const result = await pool.query(
            `SELECT p.*, u.name, u.email, u.role 
             FROM profiles p 
             JOIN users u ON u.id = p.user_id 
             WHERE p.user_id = $1`,
            [userId]
        );
        return result.rows[0];
    },
      getAllUsers: async () => {
        const result = await pool.query(
            `SELECT id, name, email, role, created_at
             FROM users
             ORDER BY name ASC`
        );
        return result.rows;
    }

};

export default userService;