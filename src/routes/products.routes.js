import { Router } from "express";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const limit = +req.query.limit || 0;
    const products = await manager.getProducts(limit);

    res.status(200).send({ payload: products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);

    if (!product) {
      res.status(404).send({ error: "Producto no encontrado" });
    } else {
      res.status(200).send({ payload: product });
    }
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

export default router;
