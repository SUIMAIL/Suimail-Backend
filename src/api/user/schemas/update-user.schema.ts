import joi from "joi"

export const updateUserSuimailNsSchema = joi.object({
  suimailNs: joi.string().required().messages({
    "any.required": "Suimail namespace is required",
  }),
})

export const updateUserMailFeeSchema = joi.object({
  mailFee: joi.number().required().messages({
    "any.required": "Mail fee is required",
  }),
})

export const updateUserFilterListSchema = joi.object({
  addresses: joi
    .array()
    .items(
      joi
        .string()
        .pattern(/^0x[a-fA-F0-9]{64}$/)
        .messages({
          "string.pattern.base": "Each address must be a valid SUI address",
        })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one address is required",
      "any.required": "Array of wallet addresses is required",
    }),
})
