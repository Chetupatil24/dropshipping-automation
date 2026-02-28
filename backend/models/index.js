const { sequelize } = require('../config/sequelize');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Supplier = require('./Supplier');
const OrderTrackingHistory = require('./OrderTrackingHistory');

// Define associations
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Supplier.hasMany(Product, { foreignKey: 'supplierId', as: 'products' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });

// Tracking history association
Order.hasMany(OrderTrackingHistory, { foreignKey: 'orderId', as: 'trackingHistory' });
OrderTrackingHistory.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Sync database
const syncDatabase = async (force = false) => {
  try {
    // alter: { drop: false } adds new columns/tables but never drops existing columns
    // This prevents conflicts with Supabase RLS policies that depend on DB columns
    await sequelize.sync({ force, alter: force ? false : { drop: false } });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Supplier,
  OrderTrackingHistory,
  syncDatabase
};
