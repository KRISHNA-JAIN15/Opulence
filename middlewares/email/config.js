const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your app password
    },
  });
};

module.exports = { createTransporter };
