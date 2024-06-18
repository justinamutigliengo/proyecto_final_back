import { Router } from "express";
import cartManager from "../dao/db/carts.manager.mdb.js";

const router = Router();

const cart = new cartManager();

// import CartManager from "../dao/FileSystem/CartManager.js";
// const cartManager = new CartManager("../src/mocks/products.json");

router.get("/", async (req, res) => {
  const carrito = await cart.getCarts();
  res.status(200).send({ payload: carrito });
});

// router.get("/:cid", async (req, res) => {
//   const carritoFound = await cartManager.getCartbyId(req.params);
//   res.status(200).send({ payload: carritoFound });
// });

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager
      .findById(req.params.cid)
      .populate("products");
    if (!cart) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }
    res.status(200).send({ payload: cart });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res
      .status(500)
      .json({ status: "error", error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  const newcart = await cart.addCart();
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

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const updatedCart = await cart
      .findByIdAndUpdate(cid, { $pull: { products: pid } }, { new: true })
      .populate("products");

    res.status(200).json({
      message: "Producto eliminado del carrito exitosamente.",
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({
      status: "error",
      error: "No se pudo eliminar el producto del carrito.",
    });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const updatedProducts = req.body.products;

    const updatedCart = await cart
      .findByIdAndUpdate(cid, { products: updatedProducts }, { new: true })
      .populate("products");

    res.status(200).json({
      message: "Carrito actualizado exitosamente.",
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    res
      .status(500)
      .json({ status: "error", error: "No se pudo actualizar el carrito." });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const newQuantity = req.body.quantity;

    const updatedCart = await cart
      .findOneAndUpdate(
        { _id: cid, "products._id": pid },
        { $set: { "products.$.quantity": newQuantity } },
        { new: true }
      )
      .populate("products");

    res.status(200).json({
      message: "Cantidad de producto actualizada exitosamente.",
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto:", error);
    res.status(500).json({
      status: "error",
      error: "No se pudo actualizar la cantidad del producto.",
    });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    const updatedCart = await cart
      .findByIdAndUpdate(cid, { products: [] }, { new: true })
      .populate("products");

    res.status(200).json({
      message:
        "Todos los productos del carrito fueron eliminados exitosamente.",
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error al eliminar todos los productos del carrito:", error);
    res.status(500).json({
      status: "error",
      error: "No se pudo eliminar todos los productos del carrito.",
    });
  }
});

export default router;
