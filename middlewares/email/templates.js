const Verification_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 26px;
            font-weight: bold;
        }
        .content {
            padding: 25px;
            color: #333;
            line-height: 1.8;
        }
        .verification-code {
            display: block;
            margin: 20px 0;
            font-size: 22px;
            color: #4CAF50;
            background: #e8f5e9;
            border: 1px dashed #4CAF50;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #ddd;
        }
        p {
            margin: 0 0 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Verify Your Email - Opulence</div>
        <div class="content">
            <p>Hello {name},</p>
            <p>Thank you for signing up with Opulence! Please confirm your email address by entering the verification code below:</p>
            <span class="verification-code">{verificationCode}</span>
            <p>This code will expire in 10 minutes for security reasons.</p>
            <p>If you did not create an account, please ignore this email. If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Opulence. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

const Welcome_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Opulence</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }
        .header {
            background-color: #007BFF;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 26px;
            font-weight: bold;
        }
        .content {
            padding: 25px;
            line-height: 1.8;
        }
        .welcome-message {
            font-size: 18px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            margin: 20px 0;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #ddd;
        }
        p {
            margin: 0 0 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Welcome to Opulence!</div>
        <div class="content">
            <p class="welcome-message">Hello {name},</p>
            <p>We're thrilled to have you join the Opulence community! Your email has been successfully verified and your account is now active.</p>
            <p>Here's what you can do now:</p>
            <ul>
                <li>Explore our premium products and services</li>
                <li>Customize your profile and preferences</li>
                <li>Stay updated with the latest luxury trends</li>
                <li>Contact our support team if you need assistance</li>
            </ul>
            <p>Thank you for choosing Opulence. We're committed to providing you with an exceptional experience.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Opulence. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

const Password_Reset_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }
        .header {
            background-color: #FF6B35;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 26px;
            font-weight: bold;
        }
        .content {
            padding: 25px;
            color: #333;
            line-height: 1.8;
        }
        .reset-button {
            display: inline-block;
            padding: 12px 25px;
            margin: 20px 0;
            background-color: #FF6B35;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
        }
        .reset-link {
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            word-break: break-all;
            font-family: monospace;
            margin: 15px 0;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #ddd;
        }
        p {
            margin: 0 0 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Reset Your Password - Opulence</div>
        <div class="content">
            <p>Hello {name},</p>
            <p>We received a request to reset your password for your Opulence account. If you made this request, click the button below to reset your password:</p>
            <div style="text-align: center;">
                <a href="{resetUrl}" class="reset-button">Reset Password</a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <div class="reset-link">{resetUrl}</div>
            <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
            <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>For security, this request was received from IP address: {ipAddress}</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Opulence. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = {
  Verification_Email_Template,
  Welcome_Email_Template,
  Password_Reset_Template,
};
