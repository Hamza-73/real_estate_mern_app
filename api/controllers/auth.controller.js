const User = require('../models/user.model')
const bcrypt = require('bcryptjs');

module.exports.signup = async (req, res , next) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        // check if user exist
        const userName = await User.findOne({ username });
        if (userName) {
            return res.status(400).json({ success: false, message: "Username already exist" });
        }
        
        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json({ success: false,  message: "Email already exist" });
        }

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ success: true,  message: "User created successfully" });
    } catch (error) {
        next(error);
    }
}