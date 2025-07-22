const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, 
  },
});

const sendMail = async (toUser, subject, text) => {
  const mailOption = {
    from: `"Subscription Tracker" <${process.env.GMAIL_USER}>`,
    to: toUser,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOption);
};

module.exports = sendMail;
