import express from "express";
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
} from "../controllers/customers.controllers.js";
import verfifyCustomerData from "../middlewares/customerSchema.middleware.js";
import checkQueryParams from "../middlewares/queryParams.middleware.js";
const router = express.Router();

router.get("/customers",checkQueryParams, listCustomers);
router.get("/customers/:id", getCustomer);
router.post("/customers", verfifyCustomerData, createCustomer);
router.put("/customers/:id",verfifyCustomerData, updateCustomer )

export default router;
