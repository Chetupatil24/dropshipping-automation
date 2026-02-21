const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../utils/logger');
const orderService = require('../services/order.service');

class RazorpayService {
  constructor() {
    // Only initialize Razorpay if valid credentials are provided
    if (process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      !process.env.RAZORPAY_KEY_ID.includes('test_') &&
      process.env.RAZORPAY_KEY_ID.startsWith('rzp_')) {
      try {
        this.razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        this.enabled = true;
        logger.info('Razorpay initialized successfully');
      } catch (error) {
        logger.warn('Razorpay initialization failed:', error.message);
        this.enabled = false;
      }
    } else {
      logger.warn('Razorpay not configured - payments disabled. Please set valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
      this.enabled = false;
    }
  }

  // Create payment order
  async createPaymentOrder(orderId, amount) {
    try {
      if (!this.enabled) {
        throw new Error('Razorpay not configured. Please set valid credentials in .env file.');
      }

      const options = {
        amount: Math.round(amount * 100), // Convert to paisa
        currency: 'INR',
        receipt: orderId,
        notes: {
          orderId: orderId
        }
      };

      const razorpayOrder = await this.razorpay.orders.create(options);

      logger.info('Razorpay order created:', {
        orderId,
        razorpayOrderId: razorpayOrder.id,
        amount
      });

      return {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      };
    } catch (error) {
      logger.error('Error creating Razorpay order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  // Verify payment signature
  verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    try {
      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      return generatedSignature === razorpaySignature;
    } catch (error) {
      logger.error('Error verifying payment signature:', error);
      return false;
    }
  }

  // Handle payment success
  async handlePaymentSuccess(paymentData) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = paymentData;

      // Verify signature
      const isValid = this.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        throw new Error('Invalid payment signature');
      }

      // Fetch payment details from Razorpay
      const payment = await this.razorpay.payments.fetch(razorpay_payment_id);

      // Update order
      await orderService.updateOrderStatus(orderId, 'confirmed', {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        paymentMethod: payment.method
      });

      // Process order (reduce stock, send emails)
      await orderService.processOrder(orderId);

      logger.info('Payment processed successfully:', {
        orderId,
        paymentId: razorpay_payment_id
      });

      return { success: true };
    } catch (error) {
      logger.error('Error handling payment success:', error);
      throw error;
    }
  }

  // Handle payment failure
  async handlePaymentFailure(orderId, error) {
    try {
      await orderService.updateOrderStatus(orderId, 'payment_failed', {
        paymentStatus: 'failed',
        notes: error.description || 'Payment failed'
      });

      logger.info('Payment failed:', { orderId, error: error.description });
    } catch (err) {
      logger.error('Error handling payment failure:', err);
    }
  }

  // Webhook handler
  async handleWebhook(payload, signature) {
    try {
      // Verify webhook signature
      const isValid = this.verifyWebhookSignature(payload, signature);

      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      const event = JSON.parse(payload);

      logger.info('Razorpay webhook received:', { event: event.event });

      switch (event.event) {
        case 'payment.captured':
          await this.handlePaymentCaptured(event.payload.payment.entity);
          break;

        case 'payment.failed':
          await this.handlePaymentFailedWebhook(event.payload.payment.entity);
          break;

        case 'order.paid':
          await this.handleOrderPaid(event.payload.order.entity);
          break;

        default:
          logger.info('Unhandled webhook event:', event.event);
      }

      return { success: true };
    } catch (error) {
      logger.error('Error handling webhook:', error);
      throw error;
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      logger.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  // Handle payment captured webhook
  async handlePaymentCaptured(payment) {
    try {
      const orderId = payment.notes.orderId;

      if (orderId) {
        await orderService.updateOrderStatus(orderId, 'confirmed', {
          paymentStatus: 'paid',
          paymentId: payment.id,
          paymentMethod: payment.method
        });

        await orderService.processOrder(orderId);
      }
    } catch (error) {
      logger.error('Error handling payment captured:', error);
    }
  }

  // Handle payment failed webhook
  async handlePaymentFailedWebhook(payment) {
    try {
      const orderId = payment.notes.orderId;

      if (orderId) {
        await orderService.updateOrderStatus(orderId, 'payment_failed', {
          paymentStatus: 'failed',
          notes: payment.error_description || 'Payment failed'
        });
      }
    } catch (error) {
      logger.error('Error handling payment failed webhook:', error);
    }
  }

  // Handle order paid webhook
  async handleOrderPaid(order) {
    try {
      const orderId = order.notes.orderId;

      if (orderId) {
        logger.info('Order paid webhook received:', { orderId });
      }
    } catch (error) {
      logger.error('Error handling order paid webhook:', error);
    }
  }

  // Initiate refund
  async initiateRefund(paymentId, amount, orderId) {
    try {
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: Math.round(amount * 100), // Convert to paisa
        notes: {
          orderId: orderId,
          reason: 'Order cancelled'
        }
      });

      logger.info('Refund initiated:', {
        orderId,
        paymentId,
        refundId: refund.id,
        amount
      });

      return refund;
    } catch (error) {
      logger.error('Error initiating refund:', error);
      throw error;
    }
  }
}

module.exports = new RazorpayService();
