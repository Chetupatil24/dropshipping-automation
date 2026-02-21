const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Product validation schemas
const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().positive().required(),
  costPrice: Joi.number().positive().required(),
  sku: Joi.string().required(),
  stock: Joi.number().integer().min(0).default(0),
  category: Joi.string().optional(),
  supplierId: Joi.string().uuid().optional(),
  images: Joi.array().items(Joi.string()).optional()
});

// Order validation schemas
const createOrderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().uuid().required(),
      quantity: Joi.number().integer().positive().required()
    })
  ).min(1).required(),
  shippingAddress: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().default('India'),
    phone: Joi.string().required()
  }).required(),
  customerEmail: Joi.string().email().required(),
  customerPhone: Joi.string().required()
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({ errors });
    }

    req.validatedBody = value;
    next();
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createProductSchema,
  createOrderSchema
};
