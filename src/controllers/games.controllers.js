import connection from '../database/database.js';

async function listGames(req, res) {
try {
    const games = (await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;')).rows
    return res.send(games)
} catch (error) {
    
}
}

export {
    listGames
}