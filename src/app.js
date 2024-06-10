import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";

import config from "./config.js";
import initSocket from "./sockets.js";
import { Server } from "socket.io";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import socketProducts from "./listeners/socketProducts.js";

const app = express();

const expressInstance = app.listen(config.PORT, async () => {
  await mongoose.connect(config.MONGODB_URI);
  console.log(`App activa en puerto ${config.PORT} enlazada a bbdd`);
});

const socketServer = initSocket(expressInstance);
app.set("socketServer", socketServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRoutes); // Rutas de vistas
app.use("/api/products", productsRoutes); // Rutas de API
app.use("/api/carts", cartsRoutes);
app.use("/static", express.static(`${config.DIRNAME}/public`)); // Rutas estáticas

// const httpServer = app.listen(config.PORT, () => {
//   console.log(`App activa en puerto ${config.PORT}`);
// });

// const socketServer = new Server(httpServer);

// socketProducts(socketServer);
