import pool from "../../config/db.js";
import flatService from "../../services/flatService.js";

export const getMyFlats = async (req, res) => {
  try {

    const userId = req.user.id;   // middleware se aayega

    const flats = await flatService.getFlatsByOwnerId(userId);

    res.status(200).json({
      success: true,
      flats: flats
    });

  } catch (error) {
    console.error("Error fetching flats:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching resident flats"
    });
  }
};