import pool from "../../config/db.js";
import flatService from "../../services/flatService.js";
import bcrypt from 'bcrypt';
import authService from "../../services/authService.js";

export const createFlat = async (req, res) => {
  try {
    const { flat_number, owner_name, owner_email, phone, flat_type } = req.body;

    // Get current subscription amount
    const getCurrentAmount = async (flat_type) => {
      const result = await pool.query(
        `SELECT monthly_amount
         FROM subscription_plans
         WHERE flat_type = $1
         AND effective_to IS NULL
         LIMIT 1`,
        [flat_type]
      );

      if (result.rows.length === 0) return null;
      return result.rows[0].monthly_amount;
    };

    // Check flat
    const flatResult = await pool.query(
      "SELECT * FROM flats WHERE flat_number = $1",
      [flat_number]
    );

    // Check user
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [owner_email]
    );

    let ownerId;

    // Create user if not exists
    if (userResult.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("pass123", salt);

      const newUser = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [owner_name, owner_email, hashedPassword, "resident"]
      );

      await authService.createUserProfile(newUser.rows[0].id);
      ownerId = newUser.rows[0].id;
    } else {
      ownerId = userResult.rows[0].id;
    }

    let flatId;

    // If flat exists
    if (flatResult.rows.length > 0) {
      const existingFlat = flatResult.rows[0];

      if (existingFlat.is_active === true) {
        return res.status(400).json({
          success: false,
          message: "Flat already active",
        });
      }

      // Same owner → activate
      if (existingFlat.owner_id === ownerId) {
        await pool.query(
          `UPDATE flats SET is_active = true WHERE flat_number = $1`,
          [flat_number]
        );

        flatId = existingFlat.id;
      } 
      else {
        // Transfer ownership
        const updatedFlat = await pool.query(
          `UPDATE flats
           SET owner_id = $1,
               phone = $2,
               flat_type = $3,
               owner_name = $4,
               is_active = true
           WHERE flat_number = $5
           RETURNING id`,
          [ownerId, phone, flat_type, owner_name, flat_number]
        );

        flatId = updatedFlat.rows[0].id;
      }
    } 
    else {
      // Create new flat
      const newFlat = await flatService.createFlat({
        flat_number,
        owner_id: ownerId,
        phone,
        flat_type,
        owner_name,
      });

      flatId = newFlat.id;
    }

    // Get last monthly record
    const lastPayment = await pool.query(
      `SELECT month, year
       FROM monthly_records
       WHERE flat_id = $1
       ORDER BY year DESC, month DESC
       LIMIT 1`,
      [flatId]
    );

    let month, year;

    if (lastPayment.rows.length > 0) {
      month = lastPayment.rows[0].month + 1;
      year = lastPayment.rows[0].year;

      if (month === 13) {
        month = 1;
        year++;
      }
    } 
    else {
      // Start from next month
      const today = new Date();
      month = today.getMonth() + 2;
      year = today.getFullYear();

      if (month === 13) {
        month = 1;
        year++;
      }
    }

    // Check monthly record exists
    const checkMonthly = await pool.query(
      `SELECT * FROM monthly_records
       WHERE flat_id = $1 AND month = $2 AND year = $3`,
      [flatId, month, year]
    );

    if (checkMonthly.rows.length === 0) {
      const amount = await getCurrentAmount(flat_type);

      await pool.query(
        `INSERT INTO monthly_records (flat_id, month, year, amount, status)
         VALUES ($1, $2, $3, $4, 'pending')`,
        [flatId, month, year, amount]
      );
    }

    res.status(201).json({
      success: true,
      message: "Flat created / activated successfully",
      flat_id: flatId,
    });

  } catch (error) {
    console.error("CREATE FLAT ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFlats = async (req,res)=>{
  try{
// req.query always returns a string value ..
    const page = parseInt(req.query.page) || 1;
    const limit =  10;

    const offset = (page - 1) * limit;

    const flats = await flatService.getActiveFlats(limit, offset);
    const total = await flatService.getActiveFlatsCount(); // so i can apply as many buttons there ..

    res.status(200).json({
      success:true,
      flats: flats,
      total: total,
      page,
      pages: Math.ceil(total / limit)
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Error fetching flats"
    });
  }
};

export const updateFlat = async (req, res) => {
  try {
    const { id } = req.params;
    const { flat_number, owner_name, owner_email, phone, flat_type } = req.body;

    let ownerId = null;

    if (owner_email) {
      // Check if user exists
      const userResult = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [owner_email]
      );

      if (userResult.rows.length > 0) {
        // Existing user
        ownerId = userResult.rows[0].id;

      } else {
        // User not found → need owner_name to create
        if (!owner_name) {
          return res.status(400).json({
            success: false,
            message: "Owner name required to create new user"
          });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("pass123", salt);

        const newUser = await pool.query(
          `INSERT INTO users (name, email, password, role) 
           VALUES ($1, $2, $3, $4) 
           RETURNING id`,
          [owner_name, owner_email, hashedPassword, 'resident']
        );

        ownerId = newUser.rows[0].id;
      }
    }

    const updatedFlat = await flatService.updateFlat(id, {
      flat_number,
      owner_id: ownerId,
      phone,
      flat_type
    });

    res.status(200).json({
      success: true,
      message: "Flat updated successfully",
      data: updatedFlat
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error updating flat"
    });
  }
};

// SOFT DELETE FLAT (Deactivate)
export const deleteFlat = async (req,res)=>{
  try{

    const { id } = req.params;

    if(!id){
      return res.status(400).json({
        success:false,
        message:"Flat ID is required"
      });
    }

    const exists = await flatService.checkFlatExists(id);

    if(!exists){
      return res.status(404).json({
        success:false,
        message:"Flat not found"
      });
    }

    await flatService.deactivateFlat(id);

    res.status(200).json({
      success:true,
      message:"Flat deactivated successfully"
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Error deactivating flat"
    });
  }
};

// GET MY FLATS (for residents)
export const getMyFlats = async (req, res) => {
  try {

    const userId = req.user.id;

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