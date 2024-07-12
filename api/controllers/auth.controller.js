const User = require('../models/user.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

module.exports.signup = async (req, res, next) => {
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
            return res.status(400).json({ success: false, message: "Email already exist" });
        }

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        next(error);
    }
}

module.exports.signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        console.log("start")
        const validUser = await User.findOne({ email });
        if (!validUser) return res.status(404).json({ success: false, message: "User Not Found" });
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) return res.status(401).json({ success: false, message: "Wrong credentials" })
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_KEY);
        console.log("token generated is ", token)
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production"
        }).status(200).json({ success: true, rest });
    } catch (error) {
        next(error);
        console.log("error in signin in", error)
    }
};

module.exports.google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
            const { password: pass, ...rest } = user._doc;
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === "production"
            }).status(200).json({ success: true, rest });

        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            console.log('avatar is ', req.body.photo)
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY);
            console.log("token generated is ", token)
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('token', token, { httpOnly: true }).status(200).json({ success: true, rest });

        }
    } catch (error) {
        next(error)
        console.log("error in signin up with google", error)
    }
}