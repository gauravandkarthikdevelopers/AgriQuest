import Joi from 'joi';

export const cropScanValidation = Joi.object({
  farmerId: Joi.string().optional(),
});

export const challengeCompletionValidation = Joi.object({
  farmerId: Joi.string().required(),
  notes: Joi.string().max(500).optional(),
});

export const missionCompletionValidation = Joi.object({
  farmerId: Joi.string().required(),
  choices: Joi.array().items(Joi.number()).required(),
  totalScoreImpact: Joi.number().required(),
});

export const leaderboardValidation = Joi.object({
  limit: Joi.number().min(1).max(100).default(10),
  page: Joi.number().min(1).default(1),
  region: Joi.string().optional(),
  village: Joi.string().optional(),
});

export const paginationValidation = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
  sort: Joi.string().optional(),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});
