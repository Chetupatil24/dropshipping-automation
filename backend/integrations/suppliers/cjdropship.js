const axios = require('axios');
const logger = require('../../utils/logger');

class CJDropshippingService {
  constructor() {
    this.apiKey = process.env.CJ_DROPSHIP_API_KEY;
    this.baseURL = 'https://developers.cjdropshipping.com/api2.0/v1';
  }

  // Get authentication token
  async getAccessToken() {
    try {
      const response = await axios.post(`${this.baseURL}/authentication/getAccessToken`, {
        email: process.env.CJ_DROPSHIP_EMAIL,
        password: process.env.CJ_DROPSHIP_PASSWORD
      });

      return response.data.data.accessToken;
    } catch (error) {
      logger.error('CJ authentication failed:', error);
      throw error;
    }
  }

  // Get product list
  async getProducts(page = 1, pageSize = 20) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseURL}/product/list`,
        {
          page,
          pageSize,
          categoryId: ''
        },
        {
          headers: {
            'CJ-Access-Token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data.list;
    } catch (error) {
      logger.error('Error fetching CJ products:', error);
      throw error;
    }
  }

  // Get product details
  async getProduct(productId) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseURL}/product/query`,
        {
          pid: productId
        },
        {
          headers: {
            'CJ-Access-Token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      const product = response.data.data;

      return {
        supplierProductId: product.pid,
        name: product.productNameEn,
        description: product.description,
        price: product.sellPrice,
        costPrice: product.sellPrice * 0.7, // Approximate cost
        images: product.productImage ? [product.productImage] : [],
        stock: product.sellStock || 0,
        category: product.categoryName,
        sku: product.productSku
      };
    } catch (error) {
      logger.error('Error fetching CJ product:', error);
      throw error;
    }
  }

  // Create order
  async createOrder(order) {
    try {
      const token = await this.getAccessToken();

      const orderData = {
        orderNumber: order.orderNumber,
        shippingCustomerName: order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName,
        shippingCountryCode: 'IN',
        shippingProvince: order.shippingAddress.state,
        shippingCity: order.shippingAddress.city,
        shippingAddress: order.shippingAddress.address1,
        shippingPhone: order.customerPhone,
        shippingPostCode: order.shippingAddress.postalCode,
        products: order.items.map(item => ({
          productId: item.supplierProductId,
          productSku: item.productSku,
          quantity: item.quantity
        }))
      };

      const response = await axios.post(
        `${this.baseURL}/shopping/order/createOrder`,
        orderData,
        {
          headers: {
            'CJ-Access-Token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('CJ order created:', {
        orderId: order.id,
        cjOrderId: response.data.data.orderId
      });

      return {
        supplierOrderId: response.data.data.orderId,
        status: 'placed'
      };
    } catch (error) {
      logger.error('Error creating CJ order:', error);
      throw error;
    }
  }

  // Get order status
  async getOrderStatus(supplierOrderId) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseURL}/shopping/order/getOrderDetail`,
        {
          orderId: supplierOrderId
        },
        {
          headers: {
            'CJ-Access-Token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      const orderData = response.data.data;

      return {
        status: orderData.orderStatus,
        trackingNumber: orderData.trackingNumber,
        shippingMethod: orderData.shippingMethod
      };
    } catch (error) {
      logger.error('Error fetching CJ order status:', error);
      throw error;
    }
  }
}

module.exports = new CJDropshippingService();
