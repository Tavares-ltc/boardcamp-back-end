import connection from "../database/database.js";
import dayjs from "dayjs";

async function listRentals(req, res) {
  const customerId = req.query.customerId;
  const gameId = req.query.gameId;

  const rentalsQuery = `SELECT 
            rentals.*,
            json_build_object(
             'id', customers.id,
             'name', customers.name) 
             AS customer,
            json_build_object(
             'id', games.id,
             'name', games.name,
             'categoryId', games."categoryId",
             'categoryName', categories.name) 
             AS game
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id 
            JOIN games ON rentals."gameId" = games.id
            JOIN categories ON categories.id = games."categoryId" 
            `;
  try {
    let rentalsData;

    if (!customerId && !gameId) {
      rentalsData = (await connection.query(rentalsQuery + ";")).rows;
    } else {
      if (customerId) {
        rentalsData = (
          await connection.query(rentalsQuery + "WHERE customers.id = $1;", [
            customerId,
          ])
        ).rows;
      } else {
        rentalsData = (
          await connection.query(rentalsQuery + "WHERE games.id = $1;", [
            gameId,
          ])
        ).rows;
      }
    }
    res.status(200);
    res.send(rentalsData);
  } catch (error) {
    res.status(404);
    res.send(error.message);
  }
}
async function createRentalData(req, res) {
  const customerId = req.body.customerId;
  const gameId = req.body.gameId;
  const daysRented = req.body.daysRented;
  const todayDate = dayjs().format("YYYY/MM/DD");

  try {
    const gameRentals = (
      await connection.query(
        `
    SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL; `,
        [gameId]
      )
    ).rows;
    const game = (
      await connection.query(
        `SELECT "stockTotal", "pricePerDay" FROM games WHERE id = $1;`,
        [gameId]
      )
    ).rows[0];
    if (gameRentals.length >= game.stockTotal) {
      return res.sendStatus(400);
    }

    const originalPrice = game.pricePerDay * daysRented;
    await connection.query(
      `INSERT INTO rentals (
    "customerId", 
    "gameId", 
    "rentDate", 
    "daysRented", 
    "returnDate", 
    "originalPrice", 
    "delayFee" )
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [customerId, gameId, todayDate, daysRented, null, originalPrice, null]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export { listRentals, createRentalData };
