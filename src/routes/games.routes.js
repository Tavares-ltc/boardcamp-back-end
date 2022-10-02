import express from "express";
import { createGame, listGames } from "../controllers/games.controllers.js";
import verifyGameData from "../middlewares/gameSchema.middleware.js";
import checkQueryParams from "../middlewares/queryParams.middleware.js";
const router = express.Router();

router.get("/games",checkQueryParams, listGames);
router.post("/games", verifyGameData, createGame);

export default router;
