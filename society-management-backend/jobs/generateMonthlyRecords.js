import cron from "node-cron";
import pool from "../config/db.js";

cron.schedule("0 0 1 * *", async () => {
  try {

    console.log("Running monthly record generation...");

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const flats = await pool.query(
      `SELECT 
        f.id AS flat_id,
        s.monthly_amount
       FROM flats f
       JOIN subscription_plans s
       ON f.flat_type = s.flat_type
       WHERE f.is_active = true
       AND s.effective_to IS NULL`
    );

    for (const flat of flats.rows) {

      await pool.query(
        `INSERT INTO monthly_records
        (flat_id, month, year, amount, status)
        VALUES ($1,$2,$3,$4,'pending')
        ON CONFLICT (flat_id, month, year) DO NOTHING`,
        [flat.flat_id, month, year, flat.monthly_amount]
      );

    }

    console.log("Monthly records generated successfully");

  } catch (error) {
    console.error("Cron job error:", error);
  }
});


