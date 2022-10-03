import connection from "../database/database.js";

async function listCustomers(req, res) {
  const cpf = req.query.cpf;
  const offset = res.locals.offset;
  const order = res.locals.order;
  console.log(order)

  try {
    let customers;
    if (cpf) {
      customers = (
        await connection.query("SELECT * FROM customers WHERE cpf LIKE $1 ;", [
          cpf + "%",
        ])
      ).rows;
    } else {
      customers = (await connection.query(`SELECT * FROM customers ORDER BY ${order} OFFSET $1;`,[offset])).rows;
    }
    if (!customers) {
      return res.sendStatus(404);
    }
    res.status(200);
    res.send(customers);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

async function getCustomer(req, res) {
  const customer_id = req.params.id;
  try {
    const customer = (
      await connection.query("SELECT * FROM customers WHERE id = $1 ;", [
        customer_id,
      ])
    ).rows[0];
    if (!customer) {
      return res.sendStatus(404);
    }
    res.status(200);
    res.send(customer);
  } catch (error) {
    return res.sendStatus(422);
  }
}

async function createCustomer(req, res) {
  const name = req.body.name;
  const phone = req.body.phone;
  const cpf = req.body.cpf;
  const birthday = req.body.birthday;

  
  try {
    const hasCPF = (await connection.query('SELECT cpf FROM customers WHERE cpf = $1 ;', [cpf])).rows[0]

  if(hasCPF){
     return res.sendStatus(409)
  }
    connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);",
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function updateCustomer(req, res) {
  const name = req.body.name;
  const phone = req.body.phone;
  const cpf = req.body.cpf;
  const birthday = req.body.birthday;
  const id = req.params.id;
  try {
    await connection.query(
      "UPDATE customers SET name= $1, phone= $2, cpf= $3, birthday= $4 WHERE id = $5;",
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(404);
    res.send(error.message);
  }
}

export { listCustomers, getCustomer, createCustomer, updateCustomer };
