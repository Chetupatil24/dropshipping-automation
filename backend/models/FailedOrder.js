const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const FailedOrder = sequelize.define('FailedOrder', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id'
            }
        },
        vendor_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'Vendor identifier: qikink, printrove, seasonsway, vendorboat'
        },
        error_message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        error_details: {
            type: DataTypes.JSON,
            allowNull: true
        },
        retry_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('pending_retry', 'retrying', 'resolved', 'permanent_failure'),
            defaultValue: 'pending_retry'
        },
        failed_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        last_retry_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        resolved_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'failed_orders',
        timestamps: true,
        indexes: [
            {
                fields: ['order_id']
            },
            {
                fields: ['vendor_id']
            },
            {
                fields: ['status']
            }
        ]
    });

    return FailedOrder;
};
