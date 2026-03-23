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






/*  
{
  "success": true,
  "dashboard": {
    "flats": [
      { "id": 3, "flat_number": "A103", "flat_type": "2BHK" }
    ],
    "total_flats": 1,
    "current_month": {
      "month": 3,
      "year": 2024,
      "status": [
        { "flat_number": "A103", "status": "Pending", "amount": 1500 }
      ]
    },
    "subscriptions": [...],
    "pending_amount": 1500,
    "recent_payments": [...],
    "notifications": [...],
    "unread_count": 2
  }
}

*/
/* 
Jo bhi column names tu SELECT me likhega
woh har row ke object me key ban jaate hain

 Example 1 (simple)
SELECT id, name FROM users;

Result:

{
  rows: [
    { id: 1, name: "Ambar" },
    { id: 2, name: "Rahul" }
  ]
}
*/



export const DashboardmangtaHai = async(req,res)=>{
       try{

        const userId = req.user.id;
        
        const year=new Date().getFullYear();
        const month=new Date().getMonth()+1;


        const flatsLao = await pool.query(`Select * from users where owner_id=$1`, userId);
        if(flatsLao.rows.length===0){
            return res.status(200).json({
                success:true,
                dashboard:{
                    total_flats: 0,
                    current_month_status: [],
                    pending_amount: 0,
                    recent_payments: [],
                    notifications: []
                }
            })
        }
           
       const flats = flatsLao.rows;
       const flatsIds=flats.map((flat)=>id);

       // getting the count of flats
       const flatsCount = flats.length;
       const pending_amountlao=await pool.query(`Select sum(amount)  as total from monthly_records where status=$1 and year=$2 and month=$3`,['pending',year ,month]);
       const pending_amount= pending_amountlao.rows[0].total;


        const current_monnth_status =await pool.query(`select f.flat_number , status , amount from flats f join monthly_records m on m.flat_id = f.id where f.owner_id =$1 and month=$2 and year=$3` , [userId , month , year]);
        const current_month = current_monnth_status.rows;


        const recentPayLao = await pool.query(` select p.amount , p.created_at ,p.payment_mode , f.flat_number from flats f join payments p 
        on p.flat_id = f.id and f.owner_id = $1;`,[userId]);
 

        const recentpayments = recentPayLao.rows;


        const notifications = await pool.query(`select message,title from notifications where user_id = $1 order by created_at desc limit 5`,[userId]);
         const notificationData = notifications.rows;


         return res.status(200).json({
            success:true,
            dashboard:{
                    total_flats: flatsCount,
                    current_month_status: current_month,
                    pending_amount: pending_amount,
                    recent_payments: recentpayments,
                    notifications: notificationData
                }
         })
       }catch(err){
        res.status(400).json({
            success:false,
            message:"Error while fething db details from backend"
        })
       }
}