import pool from "../../config/db.js";

export const getSubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    
    // total count
    const countResult = await pool.query(
      `SELECT COUNT(*) 
       FROM monthly_records m
       JOIN flats f ON m.flat_id = f.id
       WHERE f.owner_id = $1`,
      [userId]
    );


    const totalRecords = parseInt(countResult.rows[0].count);
    const result = await pool.query(
      `SELECT 
        f.flat_number,
        f.flat_type,
        m.month,
        m.year,
        m.amount,
        m.status
       FROM monthly_records m
       JOIN flats f ON m.flat_id = f.id
       WHERE f.owner_id = $1
       ORDER BY m.year DESC, m.month DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );


    res.status(200).json({
      success: true,
      subscriptions: result.rows,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords: totalRecords
    });

  } catch (error) {

    console.error("Error in getSubscriptions:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching subscriptions"
    });

  }
};


export const getSubscriptionDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year,flat_number } = req.query;  // /${month}?&year=2024&flat_number=QQ301

  if (!month || !year || !flat_number) {
  return res.status(400).json({
    success:false,
    message:"Month, year and flat_number required"
  });
}
    const result = await pool.query(
      `SELECT 
  f.flat_number,
  f.flat_type,
  m.month,
  m.year,
  m.amount AS monthly_amount,
  m.status,
  p.amount AS paid_amount,
  p.payment_mode,
  p.created_at AS payment_date
FROM monthly_records m
JOIN flats f ON m.flat_id = f.id
LEFT JOIN payments p 
  ON p.flat_id = m.flat_id
  AND p.month = m.month
  AND p.year = m.year
WHERE f.owner_id = $1
AND m.month = $2
AND m.year = $3
AND f.flat_number=$4`,
      [userId, month, year,flat_number]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No record found for this month"
      });
    }

    res.status(200).json({
      success: true,
      details: result.rows[0]
    });

  } catch (error) {
    console.error("Error in getSubscriptionDetails:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscription details"
    });
  }
};

export const getPendingAmount = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT COALESCE(SUM(m.amount), 0) as pending_amount
       FROM monthly_records m
       JOIN flats f ON m.flat_id = f.id
       WHERE f.owner_id = $1 AND m.status = 'pending'`,
      [userId]
    );

    res.status(200).json({
      success: true,
      pending_amount: result.rows[0].pending_amount
    });

  } catch (error) {
    console.error("Error in getPendingAmount:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending amount"
    });
  }
};