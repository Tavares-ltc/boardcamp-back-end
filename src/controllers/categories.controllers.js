import connection from "../database/database.js";

async function listCategories(req, res) {
  let offset = 0;
  if(req.query.offset){
    offset = req.query.offset
  }

  try {
    const categories = (await connection.query("SELECT * FROM categories OFFSET $1 ;", [offset]))
      .rows;
    res.status(200);
    res.send(categories);
  } catch (error) {
    res.status(404);
    res.send(error.message);
  }
}

async function createCategory(req, res) {
  const name = res.locals.name;
  try {
    await connection.query("INSERT INTO categories (name) VALUES($1);", [name]);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}

export { listCategories, createCategory };
