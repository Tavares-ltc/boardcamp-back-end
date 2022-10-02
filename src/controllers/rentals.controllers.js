import connection from "../database/database.js";
import dayjs from "dayjs";

async function listRentals(req, res) {
  const customerId = req.query.customerId;
  const gameId = req.query.gameId;
  const offset = res.locals.offset;
  const order = res.locals.order;

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
      rentalsData = (await connection.query(rentalsQuery + "ORDER BY $1 OFFSET $2;", [order, offset])).rows;
    } else {
      if (customerId) {
        rentalsData = (
          await connection.query(rentalsQuery + "WHERE customers.id = $1 ORDER BY $2 OFFSET = $3;", [
            customerId, order, offset
          ])
        ).rows;
      } else {
        rentalsData = (
          await connection.query(rentalsQuery + "WHERE games.id = $1 OFFSET = $2;", [
            gameId, offset
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

async function returnGame(req, res) {
  const id = req.params.id;
  const returnDate = dayjs();
  const todayDate = dayjs().format("YYYY/MM/DD");
  let daysPassed = 0;
  let delayFee = null;

  try {
    const rental = (
      await connection.query(`SELECT * FROM rentals WHERE id = $1;`, [id])
    ).rows[0];
    if (!rental) {
      return res.sendStatus(404);
    }
    if (rental.returnDate) {
      return res.sendStatus(400);
    }

    const rentDate = dayjs(rental.rentDate);
    const date2 = dayjs();

    let hours = returnDate.diff(rentDate, "hours");
    const days = Math.floor(hours / 24);
    hours = hours - days * 24;

    if (days - rental.daysRented > 0) {
      daysPassed = days - rental.daysRented;
    }

    const game = (
      await connection.query(`SELECT * FROM games WHERE id = ${rental.gameId};`)
    ).rows[0];
    const pricePerDay = game.pricePerDay;

    delayFee = daysPassed * pricePerDay;
    await connection.query(
      `UPDATE rentals SET "returnDate" = '${todayDate}', "delayFee" = ${delayFee} WHERE id = ${id};`
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

async function deleteRentalData(req, res) {
  const id = req.params.id;

  try {
    const rental = (
      await connection.query(`SELECT * FROM rentals WHERE id = $1;`, [id])
    ).rows[0];
    if (!rental) {
      return res.sendStatus(404);
    }
    if (rental.returnDate === null) {
      return res.sendStatus(400);
    }
    await connection.query(`DELETE FROM rentals WHERE id = $1;`, [id]);
    res.sendStatus(200)
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}
export { listRentals, createRentalData, returnGame, deleteRentalData };
