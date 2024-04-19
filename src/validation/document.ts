import Joi from 'joi'

export const documentCreation = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(5).max(2000).required()
})

export const documentCreationContent = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(5).max(2000).required(),
    content: Joi.string().min(5).required()
})

export const documentUpdate = Joi.object({
    id: Joi.number().min(0).required(),
    title: Joi.string().min(5).max(100),
    description: Joi.string().min(5).max(2000)
})

export const documentUpdateFile = Joi.object({
    id: Joi.number().min(0).required(),
    title: Joi.string().min(5).max(100),
    description: Joi.string().min(5).max(2000),
    originalPath: Joi.string().required()
})