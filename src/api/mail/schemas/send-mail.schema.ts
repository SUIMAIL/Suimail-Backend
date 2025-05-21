import joi from "joi"

export const sendMailSchema = joi.object({
  recipient: joi.string().required().messages({
    "any.required": "Recipient is required",
  }),
  subject: joi.string().required().messages({
    "any.required": "Subject is required",
  }),
  body: joi.string().required().messages({
    "any.required": "Body is required",
  }),
})
