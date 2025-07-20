const jwt = require("jsonwebtoken")
const User = require("../models/User")
require("dotenv").config()

const userAuth = async (req, res,next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("User not logged in");
        }
        const decodeInfo = await jwt.verify(token, process.env.SECRET_KEY)
        const { _id } = decodeInfo;
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send("User not found");
        }
        req.user = user;
        next();

    } catch (err) {
        res.status(400).send("User not verified" + err.message)
    }
}
module.exports = userAuth