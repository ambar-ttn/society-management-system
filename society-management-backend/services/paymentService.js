import pool from "../config/db.js";

const paymentService = {
    // ========== RESIDENT METHODS ==========
    
    // verify that flat belongs to user
    verifyFlatOwnership: async (flat_id, userId) => {
        const result = await pool.query(
            `SELECT id FROM flats WHERE id=$1 AND owner_id=$2`,
            [flat_id, userId]
        );
        return result.rows.length > 0;
    },

    // get monthly record
    getMonthlyRecord: async (flat_id, month, year) => {
        const result = await pool.query(
            `SELECT amount,status
             FROM monthly_records
             WHERE flat_id=$1 AND month=$2 AND year=$3`,
            [flat_id, month, year]
        );
        return result.rows[0];
    },

    // insert payment (resident)
    createPayment: async (flat_id, month, year, amount, payment_mode) => {
        const result = await pool.query(
            `INSERT INTO payments
             (flat_id,month,year,amount,payment_mode)
             VALUES ($1,$2,$3,$4,$5)
             RETURNING *`,
            [flat_id, month, year, amount, payment_mode]
        );
        return result.rows[0];
    },

    // update monthly_records status
    updateMonthlyRecord: async (flat_id, month, year) => {
        await pool.query(
            `UPDATE monthly_records
             SET status='paid'
             WHERE flat_id=$1 AND month=$2 AND year=$3`,
            [flat_id, month, year]
        );
    },

    // ========== ADMIN METHODS ==========

    // check if flat exists
    checkFlatExists: async (flat_id) => {
        const result = await pool.query(
            "SELECT id FROM flats WHERE id=$1",
            [flat_id]
        );
        return result.rows.length > 0;
    },

    // check if payment already exists
    checkPaymentExists: async (flat_id, month, year) => {
        const result = await pool.query(
            "SELECT id FROM payments WHERE flat_id=$1 AND month=$2 AND year=$3",
            [flat_id, month, year]
        );
        return result.rows.length > 0;
    },

    // insert payment (admin)
    insertPayment: async (flat_id, month, year, amount, payment_mode) => {
        await pool.query(
            "INSERT INTO payments(flat_id,month,year,amount,payment_mode) VALUES($1,$2,$3,$4,$5)",
            [flat_id, month, year, amount, payment_mode]
        );
    },

    // update monthly record status (returns rowCount)
    updateMonthlyRecordStatus: async (flat_id, month, year) => {
        const result = await pool.query(
            "UPDATE monthly_records SET status='paid' WHERE flat_id=$1 AND month=$2 AND year=$3",
            [flat_id, month, year]
        );
        return result.rowCount;
    },

    // insert into monthly records
    insertMonthlyRecord: async (flat_id, month, year, amount) => {
        await pool.query(
            "INSERT INTO monthly_records(flat_id,month,year,amount,status) VALUES($1,$2,$3,$4,'paid')",
            [flat_id, month, year, amount]
        );
    },

    // get all payments with filters
    getAllPayments: async (filters) => {
        const { flat_id, month, year } = filters;

        let query = `
            SELECT p.*, f.flat_number, f.owner_name 
            FROM payments p
            JOIN flats f ON f.id = p.flat_id
        `;
        let params = [];
        let conditions = [];

        // Filters add karo
        if (flat_id) {
            conditions.push(`p.flat_id = $${params.length + 1}`);
            params.push(flat_id);
        }
        if (month) {
            conditions.push(`p.month = $${params.length + 1}`);
            params.push(month);
        }
        if (year) {
            conditions.push(`p.year = $${params.length + 1}`);
            params.push(year);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY p.created_at DESC";

        const result = await pool.query(query, params);
        return result.rows;
    }
};
export default paymentService;