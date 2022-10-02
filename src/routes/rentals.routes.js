import express from 'express';
import {
    listRentals
} from '../controllers/rentals.controllers.js';

const router = express.Router();

router.get('/rentals', listRentals);


export default router