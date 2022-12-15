const Joi = require('Joi'); //
const { number } = require('joi');

module.exports.boardSchema = Joi.object({
    board: Joi.object({
        title: Joi.string().required(),
        //image: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
});