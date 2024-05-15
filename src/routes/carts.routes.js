import { Router } from "express";
const router = Router();

import CartManager from "../controllers/CartManager.js";
const cartManager = new CartManager("../src/mocks/products.json");

router.get("/", async (req, res) => {
  const carrito = await cartManager.getCarts();
  res.status(200).send({ payload: carrito });
});

router.get("/:cid", async (req, res) => {
  const carritoFound = await cartManager.getCartbyId(req.params);
  res.status(200).send({ payload: carritoFound });
});

router.post("/", async (req, res) => {
  const newcart = await cartManager.addCart();
  res.status(200).send({ payload: newcart });
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    await cartManager.addProductToCart(cid, pid);
    res
      .status(200)
      .send({ message: "Producto agregado al carrito exitosamente." });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({
      status: "error",
      message: "No se pudo agregar el producto al carrito.",
    });
  }
});

export default router;
