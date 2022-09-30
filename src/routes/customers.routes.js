import express from 'express';
import { listCustomers, getCustomer } from '../controllers/customers.controllers.js';

const router = express.Router();

router.get('/customers', listCustomers)
router.get('/customers/:id', getCustomer)


export default router