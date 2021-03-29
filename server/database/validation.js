//Validatation
const Joi = require("@hapi/joi");

//register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    is_admin: Joi.bool(),
  });

  return schema.validate(data);
};

//login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

//add course validation
const addCouseValidation = (data) => {
  const schema = Joi.object({
    course: Joi.string().min(6).max(6).required(),
    name: Joi.string().min(6).max(255).required(),
    name: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.addCouseValidation = addCouseValidation;
