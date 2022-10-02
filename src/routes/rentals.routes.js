import express from "express";
import {
  createRentalData,
  listRentals,
  returnGame,
  deleteRentalData,
} from "../controllers/rentals.controllers.js";
import checkQueryParams from "../middlewares/queryParams.middleware.js";
import validateRentalsData from "../middlewares/rentalsSchema.middleware.js";

const router = express.Router();

router.get("/rentals",checkQueryParams, listRentals);
router.post("/rentals", validateRentalsData, createRentalData);
router.post("/rentals/:id/return", returnGame);
router.delete("/rentals/:id", deleteRentalData);

export default router;
