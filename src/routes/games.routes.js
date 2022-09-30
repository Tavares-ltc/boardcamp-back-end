import express from 'express';
import { createGame, listGames } from '../controllers/games.controllers.js';
import verifyGameData from '../middlewares/gameSchema.middleware.js';
const router = express.Router();

router.get('/games', listGames);
router.post('/games', verifyGameData, createGame );

export default router