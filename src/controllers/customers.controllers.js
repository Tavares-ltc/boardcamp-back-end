import connection from "../database/database.js";

async function listCustomers(req, res) {
    const cpf = req.query.cpf
    try {
        let customers
        if (cpf) {
            customers = (await connection.query('SELECT * FROM customers WHERE cpf LIKE $1 ;',[cpf+'%'])).rows;
        } else {
            customers = (await connection.query('SELECT * FROM customers;')).rows;
        }
        if(!customers){
            return res.sendStatus(404)
        }
        res.status(200);
        res.send(customers)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}
async function getCustomer(req, res) {
    const customer_id = req.params.id;
    console.log(customer_id)
try {
    const customer = (await connection.query('SELECT * FROM customers WHERE id = $1 ;',[customer_id])).rows[0]
    if(!customer) {
        return res.sendStatus(404);
    }
    res.status(200);
    res.send(customer);
} catch (error) {
    return res.sendStatus(500);
}
}

export {
    listCustomers,
    getCustomer
}