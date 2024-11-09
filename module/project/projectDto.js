const Joi = require('joi');

const createProjectRequestSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  goalAmount: Joi.number().positive().required(),
  raisedAmount: Joi.number().valid(0),
  duration: Joi.string().required(),
  status: Joi.string().valid('pending', 'active').required(),
  charity: Joi.string().allow(null, ''), 
  account: Joi.string().optional(), 
  image: Joi.array().items(Joi.string()), 
  video: Joi.array().items(Joi.string())
});

module.exports = { validateProjectCreationRequest };
