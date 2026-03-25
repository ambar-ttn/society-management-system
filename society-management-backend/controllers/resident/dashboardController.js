import dashboardService from "../../services/dashboardService.js";
import pool from "../../config/db.js";

export const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        // Get user's flats using service
        const flats = await dashboardService.getUserFlats(userId);

        // If no flats, return empty dashboard
        if (flats.length === 0) {
            return res.json({
                success: true,
                dashboard: {
                    total_flats: 0,
                    current_month_status: [],
                    pending_amount: 0,
                    recent_payments: [],
                    notifications: []
                }
            });
        }

        // Extract flat IDs using service
        const flatIds = dashboardService.extractFlatIds(flats);

        // Get all dashboard data in parallel using service
        const dashboardData = await dashboardService.getDashboardData(
            userId,
            flatIds,
            currentMonth,
            currentYear
        );

        // Send response
        res.json({
            success: true,
            dashboard: {
                total_flats: flats.length,
                ...dashboardData
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            success: false,
            message: "Dashboard fetch failed"
        });
    }
};






