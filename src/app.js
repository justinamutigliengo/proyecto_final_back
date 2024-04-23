import express from "express";
import config from "./config.js";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import ProductManager from "./ProductManager.js"; // desafio 3

const app = express();

const manager = new ProductManager("./Productos.json"); // desafio 3
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/static", express.static(`${config.DIRNAME}/public`));

app.listen(config.PORT, () => {
  console.log(`App activa en puerto ${config.PORT}`);
});
