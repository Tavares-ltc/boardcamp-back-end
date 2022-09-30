import express from 'express';
import { listGames } from '../controllers/games.controllers.js';

const router = express.Router();

router.get('/games', listGames)

export default router