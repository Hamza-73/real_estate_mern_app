const bcrypt = require('bcryptjs')
const User = require('../models/user.model')

module.exports.test = async (req, res) => {
    res.json({
        message: "hi"
    });
}

module.exports.updateUser = async (req, res, next) => {
    console.log("req.user.id:", req.user.id);
    console.log("req.params.id:", req.params.id);
    console.log("Request body:", req.body);  // Add this line to see what's being received

    if (req.user.id !== req.params.id) {
        return res.status(401).json({
            success: false, message: "You can only update your own account"
        });
    }
    
    try {
        const updateFields = {};

        if (req.body.username){
            // Check if the new username is already taken
            const existingUsername = await User.findOne({ username: req.body.username });
            if (existingUsername && existingUsername._id.toString() !== req.params.id) {
                return res.status(400).json({
                    success: false,
                    message: "Username already exists. Please choose a different username."
                });
            }
            updateFields.username = req.body.username;
        }
        
        if (req.body.email) {
            // Check if the new email is already taken
            const existingEmail = await User.findOne({ email: req.body.email });
            if (existingEmail && existingEmail._id.toString() !== req.params.id) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists. Please choose a different email."
                });
            }
            updateFields.email = req.body.email;
        }
        
        if (req.body.password) {
            updateFields.password = bcrypt.hashSync(req.body.password, 10);
        }
        if (req.body.avatar) {
            updateFields.avatar = req.body.avatar;
        }

        console.log("Fields to update:", updateFields);  // Add this line to see what's being updated

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },  // Use updateFields here instead of setting all fields
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { password, ...rest } = updatedUser._doc;

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: rest
        });

    } catch (error) {
        console.log("Error in updating user", error);
        return res.status(500).json({
            success: false,
            message: "Error updating user"
        });
    }
}


modeule.exports.delete = async (req,res)=>{
    
}