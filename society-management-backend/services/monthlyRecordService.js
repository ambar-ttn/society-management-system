import pool from "../config/db.js";

const monthlyRecordService = {
    // Month mapping
    months: {
        January:1, February:2, March:3, April:4,
        May:5, June:6, July:7, August:8,
        September:9, October:10, November:11, December:12
    },

    // Get month number from string or number
    getMonthNumber: (month) => {
        return monthlyRecordService.months[month] || Number(month);
    },

    // Get total count of monthly records
    getTotalRecordsCount: async (monthNumber, year) => {
        const result = await pool.query(
            `SELECT COUNT(*) 
             FROM monthly_records m
             WHERE m.month=$1 AND m.year=$2`,
            [monthNumber, year]
        );
        return parseInt(result.rows[0].count);
    },

    // Get monthly records with pagination
    getMonthlyRecords: async (monthNumber, year, limit, offset) => {
        const result = await pool.query(
            `SELECT 
                f.id as flat_id,
                m.id,
                f.flat_number,
                f.flat_type,
                m.month,
                m.year,
                m.amount,
                m.status
             FROM monthly_records m
             JOIN flats f ON f.id = m.flat_id
             WHERE m.month=$1 AND m.year=$2
             ORDER BY f.flat_number
             LIMIT $3 OFFSET $4`,
            [monthNumber, year, limit, offset]
        );
        return result.rows;
    },

    // Get record by ID
    getRecordById: async (id) => {
        const result = await pool.query(
            `SELECT * FROM monthly_records WHERE id=$1`,
            [id]
        );
        return result.rows[0];
    },

    // Update record status
    updateRecordStatus: async (id, status) => {
        const result = await pool.query(
            `UPDATE monthly_records
             SET status=$1
             WHERE id=$2
             RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    },

    // Check if payment exists
    checkPaymentExists: async (flat_id, month, year) => {
        const result = await pool.query(
            `SELECT id FROM payments
             WHERE flat_id=$1 AND month=$2 AND year=$3`,
            [flat_id, month, year]
        );
        return result.rows.length > 0;
    },

    // Insert payment
    insertPayment: async (flat_id, month, year, amount, payment_mode = "Manual") => {
        await pool.query(
            `INSERT INTO payments(flat_id, month, year, amount, payment_mode, created_at)
             VALUES($1,$2,$3,$4,$5,NOW())`,
            [flat_id, month, year, amount, payment_mode]
        );
    }
};

export default  monthlyRecordService;