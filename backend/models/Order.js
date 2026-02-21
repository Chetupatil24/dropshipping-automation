const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'payment_pending',
      'payment_failed',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Razorpay payment ID'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'INR'
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  billingAddress: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  trackingUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shippingProvider: {
    type: DataTypes.STRING,
    allowNull: true
  },
  supplierOrderId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Order ID from supplier system'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  vendorOrders: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of vendor specific orders: [{vendor: "seasonsway", orderId: "...", status: "..."}]'
  },
  // Fulfillment & Tracking Fields
  fulfillmentService: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'vfulfill, cj, or other supplier'
  },
  fulfillmentOrderId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Order ID in fulfillment system (vFulfill/CJ)'
  },
  fulfillmentStatus: {
    type: DataTypes.STRING(30),
    allowNull: true,
    defaultValue: 'pending',
    comment: 'pending, processing, shipped, out_for_delivery, delivered'
  },
  carrierName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'BlueDart, Delhivery, FedEx, etc.'
  },
  carrierPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Carrier contact number'
  },
  currentLocation: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Current package location'
  },
  estimatedDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastTrackingUpdate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last time tracking was synced'
  },
  deliveryProofUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Photo proof of delivery if available'
  },
  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  indexes: [
    { fields: ['orderNumber'] },
    { fields: ['userId'] },
    { fields: ['status'] },
    { fields: ['paymentStatus'] }
  ]
});

module.exports = Order;
