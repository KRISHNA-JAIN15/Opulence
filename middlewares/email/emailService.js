const { createTransporter } = require("./config");
const {
  Verification_Email_Template,
  Welcome_Email_Template,
  Password_Reset_Template,
} = require("./templates");

const sendVerificationEmail = async (email, name, verificationCode) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Opulence" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - Opulence",
      html: Verification_Email_Template.replace("{name}", name).replace(
        "{verificationCode}",
        verificationCode
      ),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Opulence" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Opulence!",
      html: Welcome_Email_Template.replace("{name}", name),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
};

const sendPasswordResetEmail = async (email, name, resetUrl, ipAddress) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Opulence" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - Opulence",
      html: Password_Reset_Template.replace(/\{name\}/g, name)
        .replace(/\{resetUrl\}/g, resetUrl)
        .replace("{ipAddress}", ipAddress),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};
