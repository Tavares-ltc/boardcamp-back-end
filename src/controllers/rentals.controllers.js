import connection from "../database/database.js";

async function listRentals(req, res) {
  const customerId = req.query.customerId;
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
    if (!customerId) {
      rentalsData = (await connection.query(rentalsQuery + ";")).rows;
    } else {
      rentalsData = (await connection.query(rentalsQuery + 'WHERE rentals."customerId" = $1;', [customerId])).rows;
    }
    res.status(200);
    res.send(rentalsData);
  } catch (error) {
    res.status(404);
    res.send(error.message);
  }
}

export { listRentals };
