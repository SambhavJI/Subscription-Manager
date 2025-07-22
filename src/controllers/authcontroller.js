const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const validator = require("validator");
const sendMail = require("../utils/mail.js")

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, age, emailId, password } = req.body;

    const isUser = await User.findOne({ emailId });
    if (isUser) throw new Error("User already exists");

    const hashPass = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      age,
      emailId,
      password: hashPass,
    });

    await user.save();
    const to = user.emailId;
    const subject = "Welcome to Subscription Tracker 🎉"
    const text = `Hi ${user.firstName},

Welcome to Subscription Tracker — we're excited to have you on board!

With our platform, you can:
✅ Track all your subscriptions in one place  
📆 Get notified before your next billing date  
💰 Stay on top of your expenses

You're all set to start managing your subscriptions smarter and easier.

If you ever need help, feel free to reply to this email — we're here for you!

Cheers,  
The Subscription Tracker Team`
await sendMail(to,subject,text);
    res.status(201).send("User Added Successfully");
  } catch (err) {
    console.error("An error occurred...");
    res.status(400).json({ error: err.message || "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) throw new Error("Invalid email");

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials");

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) throw new Error("Invalid password");

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
      },
    });
  } catch (err) {
    res.status(400).json({ error: "Unable to login: " + err.message });
  }
};
const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  }).send("Logged Out Successfully")
}

module.exports = { registerUser, loginUser, logout };
