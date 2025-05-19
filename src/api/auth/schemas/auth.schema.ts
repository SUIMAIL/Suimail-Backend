import joi from "joi"

export const getLoginSchema = joi.object({
  address: joi.string().required().messages({
    "any.required": "Address is required",
  }),
})
