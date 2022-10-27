import Joi from 'joi';
const validateUsers = async (req, res, next)=>{

    const user = Joi.object({
        userName: Joi.string().email().required(),
        password: Joi.string().min(1).max(100).regex(/^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/).message("Password must have one letter and one number at least, max 100 char")
        .required(),
        role: Joi.string().valid('user', 'admin')
    });
    const validate = user.validate(req.body);
    if(validate.error){
        return res.status(400).json({
            error: validate.error.details[0].message,
          });
    }


    return next();

}

export default validateUsers