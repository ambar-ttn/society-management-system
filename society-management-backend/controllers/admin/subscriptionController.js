import pool from "../../config/db.js";
import planService from "../../services/planService.js";


// GET ALL PLANS
export const getPlans = async (req, res) => {
  try {

    const plans = await planService.getAllPlans();

    return res.status(200).json({
      success: true,
      count: plans.length,
      plans: plans
    });

  } catch (error) {

    console.error("Get Plans Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching subscription plans"
    });

  }
};




export const updatePlan = async (req, res) => {
  try {

    const { flat_type, monthly_amount } = req.body;

    if (!flat_type || !monthly_amount || monthly_amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid flat type and monthly amount are required"
      });
    }

    await planService.expireCurrentPlan(flat_type);

    // Create new plan starting next month
    const newPlan = await planService.createNewPlan(flat_type, monthly_amount);

    return res.status(200).json({
      success: true,
      message: "Subscription plan updated successfully",
      plan: newPlan
    });

  } catch (error) {

    console.error("Update Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating subscription plan"
    });

  }
};