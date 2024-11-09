const Joi = require('joi');

// Define the schema for Charity Request DTO
const registerCharityRequestSchema = Joi.object({
  user: Joi.string().required(),
  companyName: Joi.string().required(),
  address: Joi.string().required(),
  taxCode: Joi.string().required(),
  type: Joi.string().valid('individual', 'corporate', 'non-profit').required(),
  image: Joi.array().items(Joi.string()),
  video: Joi.array().items(Joi.string()),
  description: Joi.string().optional(),
  stripeId: Joi.string().optional()
});

const validateCharityRegisterRequest = (charityData) => {
  return registerCharityRequestSchema.validate(charityData);
};


module.exports = { validateCharityRegisterRequest };
