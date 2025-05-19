import joi from "joi"

export const getAddressListFeaturesSchema = joi.object({
  address: joi.string().required().messages({
    "any.required": "Address is required",
  }),
})
