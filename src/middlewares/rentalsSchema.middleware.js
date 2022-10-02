import connection from "../database/database.js";
import joi from "joi";

const rentalsSchema = joi.object({
    customerId: joi.number().integer().required(),
    gameId: joi.number().integer().required(),
    daysRented: joi.number().integer().min(1).required()
  })

async function validateRentalsData(req, res, next){
    const customerId = req.body.customerId;
    const gameId = req.body.gameId;

const validation = rentalsSchema.validate(req.body, {abortEarly: false});
if(validation.error){
    const errors = validation.error.details.map(value => value.message);
    res.status(400);
    return res.send(errors);
}

try {
    const customer = (await connection.query(`SELECT * FROM customers WHERE id = $1 ;`,[customerId])).rows[0];
if(!customer) {
    return res.sendStatus(400);
}
const game = (await connection.query(`SELECT name FROM games WHERE id = $1;`,[gameId])).rows[0];
if(!game) {
return res.sendStatus(400);
}
} catch (error) {
    res.sendStatus(500);
}
next();
}

export default validateRentalsData