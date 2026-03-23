import pool from "../config/db.js";

const flatService = {
    // Check if flat number exists
    checkFlatNumberExists: async (flat_number) => {
        const result = await pool.query(
            "SELECT * FROM flats WHERE flat_number=$1",
            [flat_number]
        );
        return result.rows.length > 0;
    },

    // Create new flat
    createFlat: async (flatData) => {
        const { flat_number, owner_id, phone, flat_type,owner_name } = flatData;
        
        const result = await pool.query(
            `INSERT INTO flats (flat_number, owner_id, phone,owner_name, flat_type)
             VALUES ($1,$2,$3,$4,$5)
             RETURNING *`,
            [flat_number, owner_id, phone,owner_name ,flat_type]
        );
        return result.rows[0];
    },

    // Get all active flats with pagination
    getActiveFlats: async (limit, offset) => {
        const result = await pool.query(
            `SELECT f.* , u.email owner_email FROM flats f join users u on u.id=f.owner_id
             WHERE is_active=true 
             ORDER BY flat_number
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    },

    // Get total count of active flats
    getActiveFlatsCount: async () => {
        const result = await pool.query(
            "SELECT COUNT(*) FROM flats WHERE is_active=true"
        );
        return parseInt(result.rows[0].count);
    },

    // Check if flat exists by ID
    checkFlatExists: async (id) => {
        const result = await pool.query(
            "SELECT id FROM flats WHERE id=$1",
            [id]
        );
        return result.rows.length > 0;
    },

    // Update flat
    updateFlat: async (id, flatData) => {
        const { flat_number, owner_id, phone, flat_type } = flatData;
        
        const result = await pool.query(
            `UPDATE flats
             SET flat_number=$1,
                 owner_id=$2,
                 phone=$3,
                 flat_type=$4
             WHERE id=$5
             RETURNING *`,
            [flat_number, owner_id, phone, flat_type, id]
        );
        return result.rows[0];
    },

    // Soft delete flat (deactivate soft delete)
    deactivateFlat: async (id) => {
        await pool.query(
            "UPDATE flats SET is_active=false WHERE id=$1",
            [id]
        );
    },

    // Get flat by ID
    getFlatById: async (id) => {
        const result = await pool.query(
            "SELECT * FROM flats WHERE id=$1",
            [id]
        );
        return result.rows[0];
    },

    // Get flats by owner ID 
    getFlatsByOwnerId: async (userId) => {
        const result = await pool.query(
            `SELECT id, flat_number, flat_type 
             FROM flats
             WHERE owner_id = $1 AND is_active=true`,
            [userId]
        );
        return result.rows;
    }
};

export default flatService;