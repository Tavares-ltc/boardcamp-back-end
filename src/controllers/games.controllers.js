import connection from "../database/database.js";

async function listGames(req, res) {
  let offset = 0;
  if(req.query.offset){
    offset = req.query.offset;
  }

  try {
    const games = (
      await connection.query(
        'SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id OFFSET $1;', [offset]
      )
    ).rows;
    return res.send(games);
  } catch (error) {
    res.status(500);
    return res.send(error.message);
  }
}
async function createGame(req, res) {
  const name = req.body.name;
  const image = req.body.image;
  const stockTotal = req.body.stockTotal;
  const categoryId = req.body.categoryId;
  const pricePerDay = req.body.pricePerDay;
  try {
    await connection.query(
      'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);',
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}
export { listGames, createGame };
