import express from 'express';
import { listCategories } from '../controllers/categories.controllers.js';
const router = express.Router();

router.get('/categories', listCategories)


export default router