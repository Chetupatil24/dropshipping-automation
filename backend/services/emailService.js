const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Email transporter configuration
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

// Email templates with Ruthan branding
const emailTemplates = {
    // Welcome email
    welcome: (user) => ({
        subject: 'Welcome to Ruthan! ✨',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; font-size: 42px; margin: 0; font-weight: 900; }
          .content { padding: 40px 20px; background: #ffffff; }
          .button { display: inline-block; background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 30px 20px; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RUTHAN</h1>
            <p style="color: white; font-size: 18px; margin: 10px 0 0 0;">Premium Fashion & Lifestyle</p>
          </div>
          <div class="content">
            <h2>Welcome, ${user.firstName}! 🎉</h2>
            <p>We're thrilled to have you join the Ruthan family!</p>
            <p>Get ready to discover trending fashion, premium footwear, and lifestyle products – all with:</p>
            <ul style="line-height: 1.8;">
              <li>⚡ Fast delivery across India (3-5 days)</li>
              <li>💰 Cash on Delivery available</li>
              <li>🎁 Premium quality products</li>
              <li>🔒 100% secure checkout</li>
            </ul>
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}" class="button">Start Shopping</a>
            </div>
          </div>
          <div class="footer">
            <p><strong>Ruthan</strong> - Crafted with ❤️ in India</p>
            <p>
              <a href="${process.env.INSTAGRAM_URL}" style="color: #9333ea; text-decoration: none; margin: 0 10px;">Instagram</a> |
              <a href="${process.env.FACEBOOK_URL}" style="color: #9333ea; text-decoration: none; margin: 0 10px;">Facebook</a>
            </p>
            <p style="font-size: 12px; margin-top: 20px;">
              Questions? Email us at <a href="mailto:${process.env.BUSINESS_EMAIL}" style="color: #9333ea;">${process.env.BUSINESS_EMAIL}</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Welcome to Ruthan, ${user.firstName}! We're thrilled to have you. Discover trending fashion and lifestyle products with fast delivery, COD, and premium quality. Start shopping at ${process.env.FRONTEND_URL}`
    }),

    // Order confirmation
    orderConfirmation: (order) => ({
        subject: `Order Confirmed! #${order.id} - Ruthan`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; font-size: 36px; margin: 0; font-weight: 900; }
          .content { padding: 40px 20px; background: #ffffff; }
          .order-box { background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .item { border-bottom: 1px solid #e5e7eb; padding: 15px 0; }
          .item:last-child { border-bottom: none; }
          .total { background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 20px; border-radius: 12px; margin-top: 20px; }
          .footer { background: #f3f4f6; padding: 30px 20px; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
            <p style="color: white; font-size: 16px; margin: 10px 0 0 0;">Order #${order.id}</p>
          </div>
          <div class="content">
            <h2>Thank you for your order!</h2>
            <p>Hi ${order.shippingAddress.firstName}, your order has been confirmed and will be delivered soon!</p>
            
            <div class="order-box">
              <h3 style="margin-top: 0;">Order Details</h3>
              ${order.items.map(item => `
                <div class="item">
                  <strong>${item.product.name}</strong><br>
                  Quantity: ${item.quantity} × ₹${item.price} = ₹${(item.quantity * item.price).toFixed(2)}
                </div>
              `).join('')}
            </div>

            <div class="total">
              <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Subtotal:</span>
                <span>₹${order.subtotal}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Shipping:</span>
                <span>${order.shipping === 0 ? 'FREE' : '₹' + order.shipping}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>Tax:</span>
                <span>₹${order.tax}</span>
              </div>
              <hr style="border: 1px solid rgba(255,255,255,0.3); margin: 15px 0;">
              <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold;">
                <span>Total:</span>
                <span>₹${order.total}</span>
              </div>
            </div>

            <p style="margin-top: 30px;">
              <strong>Shipping Address:</strong><br>
              ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
              📱 ${order.shippingAddress.phone}
            </p>
          </div>
          <div class="footer">
            <p><strong>Ruthan</strong> - Premium Fashion & Lifestyle</p>
            <p style="font-size: 12px;">Track your order at ${process.env.FRONTEND_URL}/orders/${order.id}</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Your Ruthan order #${order.id} is confirmed! Total: ₹${order.total}. Track at ${process.env.FRONTEND_URL}/orders/${order.id}`
    }),

    // Shipping notification
    shippingNotification: (order, trackingNumber) => ({
        subject: `Your Order is On The Way! 🚚 - Order #${order.id}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; font-size: 36px; margin: 0; font-weight: 900; }
          .content { padding: 40px 20px; background: #ffffff; }
          .tracking-box { background: #fef3c7; border: 2px solid #fbbf24; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center; }
          .tracking-number { font-size: 24px; font-weight: bold; color: #92400e; letter-spacing: 2px; }
          .button { display: inline-block; background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 30px 20px; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Shipped!</h1>
            <p style="color: white; font-size: 16px; margin: 10px 0 0 0;">Order #${order.id}</p>
          </div>
          <div class="content">
            <h2>Your order is on the way! 🎉</h2>
            <p>Hi ${order.shippingAddress.firstName}, great news! Your Ruthan order has been shipped and is on its way to you.</p>
            
            <div class="tracking-box">
              <p style="margin: 0 0 10px 0; color: #92400e; font-weight: bold;">Tracking Number</p>
              <div class="tracking-number">${trackingNumber}</div>
            </div>

            <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/orders/${order.id}" class="button">Track Your Order</a>
            </div>
          </div>
          <div class="footer">
            <p><strong>Ruthan</strong> - Fast Delivery Across India</p>
            <p style="font-size: 12px;">Need help? Contact us at ${process.env.BUSINESS_EMAIL}</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Your Ruthan order #${order.id} has shipped! Tracking: ${trackingNumber}. Track at ${process.env.FRONTEND_URL}/orders/${order.id}`
    }),

    // Password reset
    passwordReset: (user, resetToken) => ({
        subject: 'Reset Your Ruthan Password',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; font-size: 36px; margin: 0; font-weight: 900; }
          .content { padding: 40px 20px; background: #ffffff; }
          .button { display: inline-block; background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
          .warning { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 30px 20px; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Password</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hi ${user.firstName}, we received a request to reset your Ruthan password.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" class="button">Reset Password</a>
            </div>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              This link expires in 1 hour. If you didn't request this, please ignore this email.
            </div>
          </div>
          <div class="footer">
            <p><strong>Ruthan</strong> Security Team</p>
            <p style="font-size: 12px;">Never share this link with anyone</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Reset your Ruthan password: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}. Link expires in 1 hour.`
    })
};

// Send email function
const sendEmail = async (to, template, data) => {
    try {
        const transporter = createTransporter();
        const emailContent = emailTemplates[template](data);

        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Ruthan" <ruthanshoppingspot@gmail.com>',
            to,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html,
            replyTo: process.env.EMAIL_REPLY_TO || 'ruthanshoppingspot@gmail.com'
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info('Email sent successfully', { to, template, messageId: info.messageId });
        return info;
    } catch (error) {
        logger.error('Email sending failed', { to, template, error: error.message });
        throw error;
    }
};

module.exports = {
    sendEmail,
    emailTemplates
};
