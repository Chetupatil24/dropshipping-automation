const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const OrderTrackingHistory = sequelize.define('OrderTrackingHistory', {
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
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Tracking status at this checkpoint'
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Location of package at this checkpoint'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Detailed description of tracking event'
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'When this tracking event occurred'
    }
}, {
    tableName: 'order_tracking_history',
    timestamps: true,
    indexes: [
        { fields: ['orderId'] },
        { fields: ['timestamp'] },
        { fields: ['status'] }
    ]
});

module.exports = OrderTrackingHistory;
