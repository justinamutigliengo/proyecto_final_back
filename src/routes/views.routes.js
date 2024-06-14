import { Router } from "express";
import ProductManager from "../dao/db/products.manager.mdb.js";

const viewsManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  const listadeproductos = await viewsManager.getProductsView();
  res.render("home", { listadeproductos });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

export default router;
