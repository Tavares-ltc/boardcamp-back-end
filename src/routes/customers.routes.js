import express from 'express';
import { listCustomers, getCustomer, createCustomer } from '../controllers/customers.controllers.js';
import verfifyCustomerData from '../middlewares/customerSchema.middleware.js';
const router = express.Router();

router.get('/customers', listCustomers);
router.get('/customers/:id', getCustomer);
router.post('/customers',verfifyCustomerData ,createCustomer)


export default router