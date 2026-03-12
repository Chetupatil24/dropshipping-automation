const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('vfulfill', 'baapstore', 'eprolo', 'printrove', 'qikink', 'custom'),
    allowNull: false
  },
  apiEndpoint: {
    type: DataTypes.STRING,
    allowNull: true
  },
  apiKey: {
    type: DataTypes.STRING,
    allowNull: true
  },
  apiSecret: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  settings: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Custom settings per supplier'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastSyncedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  syncFrequency: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    comment: 'Sync frequency in minutes'
  }
}, {
  tableName: 'suppliers',
  timestamps: true
});

module.exports = Supplier;
