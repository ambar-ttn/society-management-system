import pool from "../config/db.js";

const reportService = {

    getTotalFlats: async () => {
        const result = await pool.query(
            "SELECT COUNT(*)::int FROM flats"
        );
        return result.rows[0].count;
    },

    getPaidPayments: async (month, year) => {
        const result = await pool.query(
            `SELECT COUNT(*) as count, COALESCE(SUM(amount),0) as total
             FROM monthly_records
             WHERE status='paid' AND month=$1 AND year=$2`,
            [month, year]
        );
        return result.rows[0];
    },

    getPendingPayments: async (month, year) => {
        const result = await pool.query(
            `SELECT COUNT(*) as count
             FROM monthly_records
             WHERE status='pending' AND month=$1 AND year=$2`,
            [month, year]
        );
        return result.rows[0];
    },

    getPaymentsByMode: async (month, year) => {
        const result = await pool.query(
            `SELECT 
                COALESCE(payment_mode,'unknown') as payment_mode,
                COUNT(*) as count,
                COALESCE(SUM(amount),0) as total
             FROM payments
             WHERE month=$1 AND year=$2
             GROUP BY payment_mode`,
            [month, year]
        );
        return result.rows;
    },

    getMonthlyTrend: async (year) => {
        const result = await pool.query(
            `SELECT month, year,
                    COUNT(*) as paid_count,
                    SUM(amount) as collected
             FROM monthly_records
             WHERE status='paid' AND year=$1
             GROUP BY month, year
             ORDER BY month ASC`,
            [year]
        );
        return result.rows;
    },

    getRecentPayments: async () => {
        const result = await pool.query(`
            SELECT p.*, f.flat_number, f.owner_name
            FROM payments p
            JOIN flats f ON f.id = p.flat_id
            ORDER BY p.created_at DESC
            LIMIT 5
        `);
        return result.rows;
    },

    generateReportData: async (month, year) => {

        const [
            totalFlats,
            totalPaid,
            totalPending,
            paymentsByMode,
            monthlyTrend,
            recentPayments
        ] = await Promise.all([
            reportService.getTotalFlats(),
            reportService.getPaidPayments(month, year),
            reportService.getPendingPayments(month, year),
            reportService.getPaymentsByMode(month, year),
            reportService.getMonthlyTrend(year),
            reportService.getRecentPayments()
        ]);

        return {
            summary: {
                total_flats: totalFlats,
                paid_count: parseInt(totalPaid.count || 0),
                pending_count: parseInt(totalPending.count || 0),
                total_collected: parseFloat(totalPaid.total || 0)
            },
            payment_mode_breakdown: paymentsByMode.map(row => ({
                mode: row.payment_mode,
                count: parseInt(row.count),
                amount: parseFloat(row.total)
            })),
            monthly_trend: monthlyTrend.map(row => ({
                month: row.month,
                year: row.year,
                paid: parseInt(row.paid_count),
                collected: parseFloat(row.collected)
            })),
            recent_transactions: recentPayments
        };
    }
};

export default reportService;