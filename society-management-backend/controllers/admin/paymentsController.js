import pool from "../../config/db.js";
import paymentService from "../../services/paymentService.js";

// CREATE PAYMENT
export const createPayment = async (req, res) => {
  try {
    const { flat_id, month, year, amount, payment_mode } = req.body;

    
    if (!flat_id || !month || !year || !amount || !payment_mode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid month"
      });
    }

    // 2. Check flat exists
    const flatExists = await paymentService.checkFlatExists(flat_id);
    if (!flatExists) {
      return res.status(404).json({
        success: false,
        message: "Flat not found"
      });
    }

    //  3. Get monthly record (SOURCE OF TRUTH)
    const record = await paymentService.getMonthlyRecord(flat_id, month, year);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "No due found for this month"
      });
    }

    //  4. Already paid check
    if (record.status === "paid") {
      return res.status(409).json({
        success: false,
        message: "Payment already done"
      });
    }

    //  5. Process payment (pending → paid)
    await paymentService.createPayment(
      flat_id,
      month,
      year,
      amount,
      payment_mode
    );

    await paymentService.updateMonthlyRecord(flat_id, month, year);

    //  6. Success response
    return res.status(201).json({
      success: true,
      message: "Payment recorded successfully"
    });

  } catch (error) {
    console.error("Create Payment Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// GET ALL PAYMENTS
export const getPayments = async (req, res) => {
  try {
    const { flat_id, month, year } = req.query;

    const payments = await paymentService.getAllPayments({ flat_id, month, year });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments: payments
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching payments"
    });
  }
};