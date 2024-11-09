const Joi = require('joi');

// Define the schema for Donor Request DTO
const registerDonorRequestSchema = Joi.object({
  user: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().optional(),
  status: Joi.string().valid('male', 'female', 'other').optional(),
  avatar: Joi.string().optional(),
  stripeId: Joi.string().optional()
});

const validateDonorRegisterRequest = (donorData) => {
  return registerDonorRequestSchema.validate(donorData);
};

module.exports = { validateDonorRegisterRequest };
