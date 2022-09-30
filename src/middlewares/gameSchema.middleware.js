import connection from "../database/database.js ";
import joi from 'joi';

const game_schema = joi.object({
    name: joi.string().required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().integer().min(1).required(),
    categoryId: joi.number().integer().min(1).required(),
    pricePerDay: joi.number().integer().min(1).required(),
})

async function verifyGameData (req, res, next){
    const game = req.body;
    const validation = game_schema.validate(game, {abortEarly:false});
    if(validation.error){
        res.status(400);
        return res.send(validation.error.details.map(value => value.message));
    }
    const name = req.body.name;
    
    const hasName = (await connection.query('SELECT name FROM games WHERE name = $1', [name])).rows[0];
    if(hasName){
        return res.sendStatus(409);
    }

    res.locals.name = name;
    next();
}


export default verifyGameData