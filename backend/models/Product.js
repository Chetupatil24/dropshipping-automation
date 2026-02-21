const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  compareAtPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Supplier cost'
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'suppliers',
      key: 'id'
    }
  },
  supplierProductId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Product ID from supplier system'
  },
  vendor_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'POD vendor: qikink, printrove, seasonsway, vendorboat'
  },
  vendor_sku: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'SKU used by the POD vendor'
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Weight in kg'
  },
  dimensions: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Length, width, height in cm'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  seoTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  seoDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lastSyncedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last inventory sync time'
  }
}, {
  tableName: 'products',
  timestamps: true,
  indexes: [
    { fields: ['slug'] },
    { fields: ['sku'] },
    { fields: ['category'] },
    { fields: ['isActive'] }
  ]
});

module.exports = Product;
