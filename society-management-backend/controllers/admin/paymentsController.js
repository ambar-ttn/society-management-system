import pool from "../../config/db.js";
import paymentService from "../../services/paymentService.js";

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

    const flatExists = await paymentService.checkFlatExists(flat_id);
    if (!flatExists) {
      return res.status(404).json({
        success: false,
        message: "Flat not found"
      });
    }

    const paymentExists = await paymentService.checkPaymentExists(flat_id, month, year);
    if (paymentExists) {
      return res.status(409).json({
        success: false,
        message: "Payment already exists"
      });
    }

    await paymentService.insertPayment(flat_id, month, year, amount, payment_mode);

    const updated = await paymentService.updateMonthlyRecordStatus(flat_id, month, year);

    if (updated === 0) {
      await paymentService.insertMonthlyRecord(flat_id, month, year, amount);
    }

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