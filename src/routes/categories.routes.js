import express from "express";
import {
  createCategory,
  listCategories,
} from "../controllers/categories.controllers.js";
import verifyName from "../middlewares/nameAuth.middleware.js";
import checkQueryParams from "../middlewares/queryParams.middleware.js";
const router = express.Router();

router.get("/categories",checkQueryParams, listCategories);
router.post("/categories", verifyName, createCategory);

export default router;
