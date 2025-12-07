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

const Coupon_Promo_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exclusive Coupon for You!</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
        }
        .header-subtitle {
            font-size: 16px;
            font-weight: normal;
            margin-top: 10px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
            color: #333;
            line-height: 1.8;
            text-align: center;
        }
        .coupon-box {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        .coupon-code {
            font-size: 32px;
            color: white;
            font-weight: bold;
            letter-spacing: 4px;
            background: rgba(255,255,255,0.2);
            padding: 15px 25px;
            border-radius: 8px;
            display: inline-block;
            border: 2px dashed rgba(255,255,255,0.5);
        }
        .discount-amount {
            font-size: 48px;
            color: white;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .discount-label {
            font-size: 16px;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .shop-button {
            display: inline-block;
            padding: 15px 40px;
            margin: 20px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            transition: transform 0.3s;
        }
        .shop-button:hover {
            transform: scale(1.05);
        }
        .features {
            display: flex;
            justify-content: space-around;
            margin: 25px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .feature {
            text-align: center;
            flex: 1;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        .feature-text {
            font-size: 12px;
            color: #666;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 20px;
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
        <div class="header">
            🎉 Exclusive Offer Just for You!
            <div class="header-subtitle">Special discount from Opulence</div>
        </div>
        <div class="content">
            <p>Hello {name},</p>
            <p>We have an amazing offer waiting for you! Use this exclusive coupon code on your next purchase and save big.</p>
            
            <div class="coupon-box">
                <div class="discount-amount">₹{discountAmount} OFF</div>
                <div class="discount-label">Your Exclusive Discount</div>
                <div style="margin-top: 20px;">
                    <div class="coupon-code">{couponCode}</div>
                </div>
            </div>
            
            <p>Simply apply this code at checkout to enjoy your savings!</p>
            
            <a href="http://localhost:5173/products" class="shop-button">Shop Now →</a>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🚚</div>
                    <div class="feature-text">Free Shipping</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <div class="feature-text">Secure Payment</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">↩️</div>
                    <div class="feature-text">Easy Returns</div>
                </div>
            </div>
            
            <p style="font-size: 14px; color: #666;">Don't miss out on this limited-time offer. Happy shopping!</p>
        </div>
        <div class="footer">
            <p>You received this email because you're a valued Opulence customer.</p>
            <p>&copy; ${new Date().getFullYear()} Opulence. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

const Return_Completed_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Return Completed - Refund Processed</title>
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
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            font-size: 26px;
            font-weight: bold;
        }
        .header-subtitle {
            font-size: 16px;
            font-weight: normal;
            margin-top: 10px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
            color: #333;
            line-height: 1.8;
        }
        .refund-box {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
            color: white;
        }
        .refund-amount {
            font-size: 42px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .refund-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            opacity: 0.9;
        }
        .order-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #666;
            font-weight: 500;
        }
        .detail-value {
            color: #333;
            font-weight: 600;
        }
        .wallet-info {
            background: #e0f2fe;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .wallet-info p {
            margin: 0;
            color: #0369a1;
            font-weight: 500;
        }
        .shop-button {
            display: inline-block;
            padding: 15px 40px;
            margin: 20px 0;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 20px;
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
        <div class="header">
            ✅ Return Completed Successfully!
            <div class="header-subtitle">Your refund has been processed</div>
        </div>
        <div class="content">
            <p>Hello {name},</p>
            <p>Great news! Your return request has been successfully processed and the refund has been added to your wallet.</p>
            
            <div class="refund-box">
                <div class="refund-label">Refund Amount</div>
                <div class="refund-amount">₹{refundAmount}</div>
            </div>
            
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Order Number</span>
                    <span class="detail-value">{orderNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Return Initiated</span>
                    <span class="detail-value">{returnDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Completed On</span>
                    <span class="detail-value">{completedDate}</span>
                </div>
            </div>
            
            <div class="wallet-info">
                <p>💳 The refund of ₹{refundAmount} has been credited to your Opulence Wallet.</p>
                <p style="margin-top: 10px; font-size: 14px;">Your new wallet balance: ₹{newBalance}</p>
            </div>
            
            <p>You can use your wallet balance for future purchases on Opulence.</p>
            
            <div style="text-align: center;">
                <a href="http://localhost:5173/products" class="shop-button">Continue Shopping →</a>
            </div>
            
            <p style="font-size: 14px; color: #666;">Thank you for shopping with Opulence. We hope to serve you again soon!</p>
        </div>
        <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
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
  Coupon_Promo_Template,
  Return_Completed_Template,
};
