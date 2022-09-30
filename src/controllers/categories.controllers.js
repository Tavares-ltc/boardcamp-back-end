import connection from '../database/database.js';

async function listCategories(req, res){
    try {
    const categories = await connection.query('SELECT * FROM categories;').rows
        res.status(200)
        res.send(categories)
    } catch (error) {
        res.status(404)
        res.send(error.message)
    }
}

export {
    listCategories
}