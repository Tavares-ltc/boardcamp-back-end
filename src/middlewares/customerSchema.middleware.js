import connection from "../database/database.js";
import JoiDate from '@hapi/joi-date'
import joiImport from 'joi';
const joi = joiImport.extend(JoiDate);

const customerSchema = joi.object(
    {
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
        cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
        birthday: joi.date().format('YYYY-MM-DD').required()
    }
)

async function verfifyCustomerData(req, res, next) {
    const cpf = req.body.cpf;
 const validation = customerSchema.validate(req.body, {abortEarly: false});
 if(validation.error) {
    const errors = validation.error.details.map(value => value.message);
    res.status(400);
    return res.send(errors);
 }
 
 next()

}

export default verfifyCustomerData