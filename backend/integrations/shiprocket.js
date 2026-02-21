const axios = require('axios');
const logger = require('../utils/logger');

class ShiprocketService {
  constructor() {
    this.baseURL = process.env.SHIPROCKET_API_URL || 'https://apiv2.shiprocket.in/v1/external';
    this.token = null;
    this.tokenExpiry = null;
  }

  // Authenticate and get token
  async authenticate() {
    try {
      if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.token;
      }

      const response = await axios.post(`${this.baseURL}/auth/login`, {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      });

      this.token = response.data.token;
      this.tokenExpiry = Date.now() + (9 * 60 * 60 * 1000); // 9 hours

      logger.info('Shiprocket authenticated successfully');
      return this.token;
    } catch (error) {
      logger.error('Shiprocket authentication failed:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Shiprocket');
    }
  }

  // Create order on Shiprocket
  async createOrder(order) {
    try {
      await this.authenticate();

      const shiprocketOrder = {
        order_id: order.orderNumber,
        order_date: new Date(order.createdAt).toISOString().split('T')[0],
        pickup_location: 'Primary',
        billing_customer_name: order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName,
        billing_last_name: order.shippingAddress.lastName,
        billing_address: order.shippingAddress.address1,
        billing_address_2: order.shippingAddress.address2 || '',
        billing_city: order.shippingAddress.city,
        billing_pincode: order.shippingAddress.postalCode,
        billing_state: order.shippingAddress.state,
        billing_country: order.shippingAddress.country || 'India',
        billing_email: order.customerEmail,
        billing_phone: order.customerPhone,
        shipping_is_billing: true,
        order_items: order.items.map(item => ({
          name: item.productName,
          sku: item.productSku,
          units: item.quantity,
          selling_price: parseFloat(item.price),
          discount: 0
        })),
        payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
        sub_total: parseFloat(order.subtotal),
        length: 10,
        breadth: 10,
        height: 10,
        weight: 0.5
      };

      const response = await axios.post(
        `${this.baseURL}/orders/create/adhoc`,
        shiprocketOrder,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Shiprocket order created:', {
        orderId: order.id,
        shiprocketOrderId: response.data.order_id,
        shipmentId: response.data.shipment_id
      });

      return {
        shiprocketOrderId: response.data.order_id,
        shipmentId: response.data.shipment_id,
        status: response.data.status
      };
    } catch (error) {
      logger.error('Error creating Shiprocket order:', error.response?.data || error.message);
      throw new Error('Failed to create shipping order');
    }
  }

  // Generate AWB (Air Waybill) and schedule pickup
  async generateAWB(shipmentId, courierId = null) {
    try {
      await this.authenticate();

      const payload = {
        shipment_id: shipmentId
      };

      if (courierId) {
        payload.courier_id = courierId;
      }

      const response = await axios.post(
        `${this.baseURL}/courier/assign/awb`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('AWB generated:', {
        shipmentId,
        awb: response.data.response.data.awb_code
      });

      return {
        awb: response.data.response.data.awb_code,
        courierId: response.data.response.data.courier_company_id,
        courierName: response.data.response.data.courier_name
      };
    } catch (error) {
      logger.error('Error generating AWB:', error.response?.data || error.message);
      throw new Error('Failed to generate AWB');
    }
  }

  // Schedule pickup
  async schedulePickup(shipmentId) {
    try {
      await this.authenticate();

      const response = await axios.post(
        `${this.baseURL}/courier/generate/pickup`,
        {
          shipment_id: [shipmentId]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Pickup scheduled:', { shipmentId });

      return response.data;
    } catch (error) {
      logger.error('Error scheduling pickup:', error.response?.data || error.message);
      throw new Error('Failed to schedule pickup');
    }
  }

  // Track shipment
  async trackShipment(awb) {
    try {
      await this.authenticate();

      const response = await axios.get(
        `${this.baseURL}/courier/track/awb/${awb}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error tracking shipment:', error.response?.data || error.message);
      throw new Error('Failed to track shipment');
    }
  }

  // Get available couriers for shipment
  async getAvailableCouriers(shipmentId) {
    try {
      await this.authenticate();

      const response = await axios.get(
        `${this.baseURL}/courier/serviceability`,
        {
          params: {
            shipment_id: shipmentId
          },
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      return response.data.data.available_courier_companies;
    } catch (error) {
      logger.error('Error fetching available couriers:', error.response?.data || error.message);
      throw new Error('Failed to fetch available couriers');
    }
  }

  // Cancel shipment
  async cancelShipment(awb) {
    try {
      await this.authenticate();

      const response = await axios.post(
        `${this.baseURL}/orders/cancel/shipment/awbs`,
        {
          awbs: [awb]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Shipment cancelled:', { awb });

      return response.data;
    } catch (error) {
      logger.error('Error cancelling shipment:', error.response?.data || error.message);
      throw new Error('Failed to cancel shipment');
    }
  }

  // Get complete shipping label (full flow)
  async createShippingLabel(order) {
    try {
      // 1. Create order on Shiprocket
      const { shipmentId } = await this.createOrder(order);

      // 2. Generate AWB
      const { awb, courierName } = await this.generateAWB(shipmentId);

      // 3. Schedule pickup
      await this.schedulePickup(shipmentId);

      return {
        shipmentId,
        trackingNumber: awb,
        shippingProvider: courierName,
        trackingUrl: `https://shiprocket.co/tracking/${awb}`
      };
    } catch (error) {
      logger.error('Error creating shipping label:', error);
      throw error;
    }
  }
}

module.exports = new ShiprocketService();
