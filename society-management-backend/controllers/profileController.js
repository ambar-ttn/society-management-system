import profileService from "../services/profileService.js";

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

