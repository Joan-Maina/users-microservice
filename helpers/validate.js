const joi = require("joi");
const pattern =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

module.exports = (user) => {
  const schema = joi.object({
    fullname: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().regex(pattern).min(8).required(),
  });
  return schema.validate(user);
};
