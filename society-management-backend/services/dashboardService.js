import pool from "../config/db.js";

const dashboardService = {
    //  RESIDENT METHODS 
    // Get user's flats
    
    getUserFlats: async (userId) => {
        const result = await pool.query(
            "SELECT id, flat_number FROM flats WHERE owner_id=$1",
            [userId]
        );
        return result.rows;
    },

    // Get current month status for flats
    getCurrentMonthStatus: async (flatIds, month, year) => {
        const result = await pool.query(
            `SELECT f.flat_number, m.status, m.amount
             FROM monthly_records m
             JOIN flats f ON f.id = m.flat_id
             WHERE m.flat_id = ANY($1)
             AND m.month = $2 AND m.year = $3`,
            [flatIds, month, year]
        );
        return result.rows;
    },

    // Get recent payments
    getRecentPayments: async (flatIds, limit = 5) => {
        const result = await pool.query(
            `SELECT f.flat_number, p.amount, p.payment_mode, p.created_at
             FROM payments p
             JOIN flats f ON f.id = p.flat_id
             WHERE p.flat_id = ANY($1)
             ORDER BY p.created_at DESC
             LIMIT $2`,
            [flatIds, limit]
        );
        return result.rows;
    },

    // Get user notifications
    getUserNotifications: async (userId, limit = 5) => {
        const result = await pool.query(
            `SELECT id,title, message, created_at
             FROM notifications
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT $2`,
            [userId, limit]
        );
        return result.rows;
    },

    // Get pending amount total
    getPendingAmount: async (flatIds) => {
        const result = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS pending_amount
             FROM monthly_records
             WHERE flat_id = ANY($1)
             AND status = 'pending'`,
            [flatIds]
        );
        return result.rows[0].pending_amount;
    },

    getDashboardData: async (userId, flatIds, currentMonth, currentYear) => {
        const [currentMonthStatus, recentPayments, notifications, pendingAmount] = await Promise.all([
            dashboardService.getCurrentMonthStatus(flatIds, currentMonth, currentYear),
            dashboardService.getRecentPayments(flatIds),
            dashboardService.getUserNotifications(userId),
            dashboardService.getPendingAmount(flatIds)
        ]);

        return {
            current_month_status: currentMonthStatus,
            recent_payments: recentPayments,
            notifications: notifications,
            pending_amount: pendingAmount
        };
    },

    // Get flat IDs from flats array
    extractFlatIds: (flats) => {
        return flats.map(f => f.id);
    },

    //  ADMIN METHODS 

    // Get total flats count
    getTotalFlats: async () => {
        const result = await pool.query(
            "SELECT COUNT(*) FROM flats"
        );
        return parseInt(result.rows[0].count);
    },

    // Get total collection amount
    getTotalCollected: async () => {
        const result = await pool.query(
            "SELECT COALESCE(SUM(amount),0) AS total FROM payments"
        );
        return parseFloat(result.rows[0].total);
    },

    // Get pending payments count
    getPendingPaymentsCount: async () => {
        const result = await pool.query(
            "SELECT COUNT(*) FROM monthly_records WHERE LOWER(status)='pending'"
        );
        return parseInt(result.rows[0].count);
    },

    // Get current month collection
    getCurrentMonthCollection: async (month, year) => {
        const result = await pool.query(
            `SELECT COALESCE(SUM(amount),0) AS total
             FROM payments
             WHERE month = $1 AND year = $2`,
            [month, year]
        );
        return parseFloat(result.rows[0].total);
    },

    // Get monthly trend
    getMonthlyTrend: async (limit = 6) => {
        const result = await pool.query(
            `SELECT 
                month,
                year,
                SUM(amount) AS total
             FROM monthly_records
             WHERE LOWER(status)='paid'
             GROUP BY month, year
             ORDER BY year DESC, month DESC
             LIMIT $1`,
            [limit]
        );
        return result.rows;
    },// in frontend we have made dat wit repect to selected year yahan se to poota bhejre 

    // Get recent payments for admin
    getAdminRecentPayments: async (limit = 5) => {
        const result = await pool.query(
            `SELECT 
                p.amount,
                f.flat_number
             FROM payments p
             JOIN flats f ON f.id = p.flat_id
             ORDER BY p.created_at DESC
             LIMIT $1`,
            [limit]
        );
        return result.rows;
    },

    // Get complete admin dashboard data
    getAdminDashboardData: async () => {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const [
            totalFlats,
            totalCollected,
            pendingPayments,
            currentMonthCollection,
            monthlyTrend,
            recentPayments
        ] = await Promise.all([
            dashboardService.getTotalFlats(),
            dashboardService.getTotalCollected(),
            dashboardService.getPendingPaymentsCount(),
            dashboardService.getCurrentMonthCollection(currentMonth, currentYear),
            dashboardService.getMonthlyTrend(),
            dashboardService.getAdminRecentPayments()
        ]);

        return {
            total_flats: totalFlats,
            total_collected: totalCollected,
            pending_payments: pendingPayments,
            current_month: currentMonthCollection,
            monthly_trend: monthlyTrend,
            recent_payments: recentPayments
        };
    }
};

export default dashboardService;