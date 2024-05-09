import * as Joi from "joi";
import { STATUS, USER_FIELDS } from "../utils/enum";

export const CreateUserDto = {
  body: Joi.object().keys({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(25).required(),
    email: Joi.string().email().required(),
    phoneNo: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/, {
        name: "numeric digits only",
      })
      .required(),
  }),
};

export const GetUsersDto = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    field: Joi.string().valid(...Object.values(USER_FIELDS)),
    search: Joi.string(),
  }),
};

export const GetUserByIDDto = {
  params: Joi.object().keys({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Invalid ObjectId")
      .required(),
  }),
};

export const EditUserDto = {
  params: Joi.object().keys({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Invalid ObjectId")
      .required(),
  }),
  body: Joi.object().keys({
    firstName: Joi.string().min(3).max(20).optional().allow(null),
    lastName: Joi.string().min(3).max(25).optional().allow(null),
    email: Joi.string().email().optional().allow(null),
    status: Joi.string()
      .valid(...Object.values(STATUS))
      .optional(),
    phoneNo: Joi.string()
      .length(10)
      .optional()
      .pattern(/^[0-9]+$/, {
        name: "numeric digits only",
      })
      .allow(null),
  }),
};

export const BulkUpdateDto = {
  query: Joi.object().keys({
    status: Joi.string()
      .valid(...Object.values(STATUS))
      .optional(),
    isDeleted: Joi.boolean().optional(),
  }).xor('status', 'isDeleted').messages({
    'object.xor': 'Either "status" or "isDeleted" should be present at a time, but not both.',
  }),
  body: Joi.object().keys({
    ids: Joi.array().items(
      Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message("Invalid ObjectId")
        .required()
    ).required(),
  }).required(),
};
