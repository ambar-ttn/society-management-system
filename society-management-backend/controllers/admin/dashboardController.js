import pool from "../../config/db.js";
import dashboardService from "../../services/dashboardService.js";

export const getAdminDashboard = async (req, res) => {
try {

    const dashboardData = await dashboardService.getAdminDashboardData();

    res.status(200).json({
        success: true,
        dashboard: dashboardData
    });

} catch (error) {
    console.error(error);

    res.status(500).json({
        success: false,
        message: "Dashboard fetch failed"
    })
}
};

