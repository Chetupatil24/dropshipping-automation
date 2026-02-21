const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productSku: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price at time of order'
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Supplier cost at time of order'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: true
});

module.exports = OrderItem;
