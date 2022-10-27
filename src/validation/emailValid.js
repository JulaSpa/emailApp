import Joi from 'joi';

const validateEmails = async (req, res, next)=>{

    const eml = Joi.object({
        emailto: Joi.string().email().required(),
        title: Joi.string().min(1).max(30).message("Title must have at least one letter or one number, max 30 char")
        .required(),
        content: Joi.string().min(1).max(200).message("content must have at least one letter or one number, max 200 char")
        .required(),
        uId: Joi.number(),
        numberOfEmails: Joi.number()
    });
    const validate = eml.validate(req.body);
    if(validate.error){
        return res.status(400).json({
            error: validate.error.details[0].message,
          });
    }

    return next();

}

export default validateEmails