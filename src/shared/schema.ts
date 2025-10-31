import Joi from "joi";

import { SortEnum } from "./enums";

export const page = Joi.number().min(1).default(1);
export const limit = Joi.number().min(5).max(30).default(30);
export const sort = Joi.string()
    .valid(SortEnum.desc, SortEnum.asc, SortEnum.DESC, SortEnum.ASC)
    .default(SortEnum.desc);

export const positiveNumber = Joi.number().greater(0).default(1);
export const negativeNumber = Joi.number().less(0).default(-1);
