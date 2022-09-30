import connection from "../database/database.js";

async function verifyName(req, res, next){
    const name = req.body.name;
    if(!name){
        return res.sendStatus(400)
    }

    try {
        const alreadyHasName = (await connection.query('SELECT * FROM categories WHERE name = $1;',[name])).rows[0];
        console.log(alreadyHasName)
    if(alreadyHasName){
        return res.sendStatus(409);
    }
    res.locals.name = name
    next();
    } catch (error) {
    res.status(500);  
    res.send(error.message)  
    }
}

export default verifyName