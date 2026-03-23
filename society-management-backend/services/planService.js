import pool from "../config/db.js";

const planService = {
    // GET ALL PLANS
    getAllPlans: async () => {
        const result = await pool.query(
            `SELECT id, flat_type, monthly_amount
             FROM subscription_plans
             WHERE effective_to IS NULL
             ORDER BY flat_type`
        );
        return result.rows;
    },

    // UPDATE PLAN - expire current plan
    expireCurrentPlan: async (flat_type) => {
        await pool.query(
            `UPDATE subscription_plans
             SET effective_to = DATE_TRUNC('month', CURRENT_DATE) 
                                + INTERVAL '1 month - 1 day'
             WHERE flat_type = $1
             AND effective_to IS NULL`,
            [flat_type]
        );
    },
// = current date ko month ke start pe le aata hai
    // UPDATE PLAN - create new plan
    createNewPlan: async (flat_type, monthly_amount) => {
        const result = await pool.query(
            `INSERT INTO subscription_plans
             (flat_type, monthly_amount, effective_from, effective_to)
             VALUES (
               $1,
               $2,
               DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month',
               NULL
             )
             RETURNING *`,
            [flat_type, monthly_amount]
        );
        return result.rows[0];
    }
};

export default planService;