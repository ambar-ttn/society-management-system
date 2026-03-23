import pool from "../../config/db.js";
import flatService from "../../services/flatService.js";
import bcrypt from 'bcrypt';
import authService from "../../services/authService.js";

export const createFlat = async (req,res)=>{
 try{
    const { flat_number, owner_name, owner_email, phone, flat_type } = req.body;

    const exists = await flatService.checkFlatNumberExists(flat_number);
    if(exists){
      return res.status(400).json({
        success:false,
        message:"Flat number already exists"
      });
    }

    // Check if user exists with this email
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [owner_email]
    );
    
    let ownerId;

    // If user doesn't exist, create new resident user
    if (userResult.rows.length === 0) {
      // Hash default password "pass123"
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("pass123", salt);
      

      // Create new user
      const newUser = await pool.query(
        `INSERT INTO users (name, email, password, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id`,
        [owner_name, owner_email, hashedPassword, 'resident']
      );
    
     await authService.createUserProfile(newUser.rows[0].id);

      
      ownerId = newUser.rows[0].id;
    } else {
      // Use existing user
      ownerId = userResult.rows[0].id;
    }

    // Create the flat with owner_id
    const newFlat = await flatService.createFlat({

      flat_number, 
      owner_id: ownerId, 
      phone, 
      flat_type,
      owner_name
    });
   console.log(newFlat);
    const am = await pool.query(`SELECT monthly_amount  as amount from subscription_plans where flat_type=$1`,[newFlat.flat_type])
    const amount = am.rows[0].amount;
    console.log(amount);

    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Create monthly record with pending status
    await pool.query(
      `INSERT INTO monthly_records (flat_id, month, amount, status, year) 
       VALUES ($1, $2, $3, $4, $5)`,
      [newFlat.id, currentMonth, amount, 'pending', currentYear]
    );

    res.status(201).json({
      success:true,
      message:"Flat created successfully with pending monthly record",
      data:newFlat
    });

  }catch(error){

    console.error(error);
    res.status(500).json({
      success:false,
      message:"Error creating flat"
    });
  }
};

export const getFlats = async (req,res)=>{
  try{
// req.query always returns a string value ..
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

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