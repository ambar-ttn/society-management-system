import profileService from "../services/profileService.js";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await profileService.getProfileByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      profile: profile
    });

  } catch (err) {
    console.error("Get Profile Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching profile"
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      gender,
      date_of_birth,
      about,
      contact_number,
      password,
      confirmPassword
    } = req.body;

    // Check if profile exists using service
    const profileExists = await profileService.checkProfileExists(userId);

    if (!profileExists) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Update profile fields using service
    const updatedProfile = await profileService.updateProfile(userId, {
      gender,
      date_of_birth,
      about,
      contact_number
    });

    // Handle password change if requested
    if (password || confirmPassword) {
      const validation = profileService.validatePassword(password, confirmPassword);
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }

      // Hash and update password using service
      const hashedPassword = await profileService.hashPassword(password);
      await profileService.updateUserPassword(userId, hashedPassword);
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile
    });

  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};

// DELETE PROFILE
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedProfile = await profileService.deleteProfileByUserId(userId);

    if (!deletedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    });

  } catch (err) {
    console.error("Delete Profile Error:", err);
    return res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
};

export const gettingProfile = async(req,res)=>{
         
    try{
           const userId = req.user.id;
           const profileLunga = await pool.query(`select * from profiles where user_id=$1`,[userId]);

           const profileData = profileLunga.rows[0];
           return res.status(200).json({
            success:true,
            data:profileData
           })

         }catch(err){
          res.status(404).json({
            success:false,
            message:"Profile not found error"
          })

         }
 }


export const updatingProfile = async(req,res)=>{
      try{
          
        const userId = req.user.id ; 


        const{gender , contact_number , date_of_birth,about ,password ,confirmPassword} = req.body;
        const findProfile = await pool.query(`select * from proifles where user_id=$1`,[userId]);
        if(findProfile.rows.length===0){
          return res.status(400).json({
            success:false,
            message:"You have no profile"
          })
        }



        const updateProfie = await pool.query(`UPDATE profiles set gender=$1 , date_of_birth=$2, contact_number=$3 , about=$4 where user_id=$5`,[gender,date_of_birth.contact_number,about,userId]);


        if(confirmPassword && password){
            if(confirmPassword===password){

              const hashedPassword = await bcrypt.hash(password,10);

              const userUpdate = await pool.query(`update users set password = $1`,hashedPassword);

            }
            else{
              return res.status(500).json({
                success:false,
                message:'Not matching password'
              })
            }

        }
      }catch(err){
      return res.status(500).json({
         success:false,
         message:"Error in updating profile"
      })

      }
 }