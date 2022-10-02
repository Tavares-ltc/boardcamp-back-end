import express from "express";
import {
  createCategory,
  listCategories,
} from "../controllers/categories.controllers.js";
import verifyName from "../middlewares/nameAuth.middleware.js";
const router = express.Router();

router.get("/categories", listCategories);
router.post("/categories", verifyName, createCategory);

export default router;
