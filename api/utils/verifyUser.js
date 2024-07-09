const jwt = require('jsonwebtoken')

module.exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("cookie is  ", req.cookies)
        console.log("token is ", token)
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized" })
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) return res.status(403).json({ success: false, message: "Forbidden" })
                console.log("user is ", user)
            req.user = user
            next()
        })
    } catch (error) {
        console.log("error in verifying ", error)
    }
}