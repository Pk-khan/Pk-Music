const Joi = require('joi');

const registerUser = Joi.object({
    name: Joi.string()
        .min(2)
        .max(1024)
        .required(),

    email: Joi.string()
        .min(5)
        .max(1024)
        .required()
        .email(),

    password: Joi.string()
        .min(5)
        .max(1024)
        .required(),
});

const registerArtist = Joi.object({
    name: Joi.string()
        .min(2)
        .max(1024)
        .required(),

    email: Joi.string()
        .min(5)
        .max(1024)
        .required()
        .email(),

    password: Joi.string()
        .min(5)
        .max(1024)
        .required(),

    mobile: Joi.number()
        .integer()
        .required()


});


const login = Joi.object({

    email: Joi.string()
        .min(5)
        .max(1024)
        .required()
        .email(),

    password: Joi.string()
        .min(5)
        .max(1024)
        .required(),

});


function validateUser(obj) {
    return registerUser.validate(obj);
}


function validateArtist(obj) {
    return registerArtist.validate(obj);
}

function validateLogin(obj) {
    return login.validate(obj);
}

module.exports.validateUser = validateUser;
module.exports.validateArtist = validateArtist;
module.exports.validateLogin = validateLogin;