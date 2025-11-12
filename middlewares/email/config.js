const nodemailer = require("nodemailer");

// Ensure dotenv is loaded (in case it wasn't loaded before this module)
require("dotenv").config();

// Validate email credentials
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("⚠️  EMAIL_USER or EMAIL_PASS is not set in .env file");
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not Set");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not Set");
}

const transporter = nodemailer.createTransport({
  service: "gmail", // Using Gmail service directly
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Email transporter verification failed:", error.message);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

module.exports = transporter;
