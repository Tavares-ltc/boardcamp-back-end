import express from 'express';
import {
    createRentalData,
    listRentals
} from '../controllers/rentals.controllers.js';
import validateRentalsData from '../middlewares/rentalsSchema.middleware.js'

const router = express.Router();

router.get('/rentals', listRentals);
router.post('/rentals', validateRentalsData, createRentalData)


export default router