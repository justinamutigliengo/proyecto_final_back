import ProductManager from "../../src/dao/db/ProductManagerMdb.js";
const manager = new ProductManager();

const socketProducts = (socketServer) => {
  socketServer.on("connection", async (socket) => {
    console.log("client connected con ID:", socket.id);
    const listadeproductos = await manager.getProductsView();

    socketServer.emit("enviodeproducts", listadeproductos);

    socket.on("addProduct", async (obj) => {
      await manager.addProduct(obj);
      const listadeproductos = await manager.getProductsView();
      socketServer.emit("enviodeproducts", listadeproductos);
    });

    socket.on("deleteProduct", async (id) => {
      await manager.deleteProduct(id);
      const listadeproductos = await manager.getProductsView();
      socketServer.emit("enviodeproducts", listadeproductos);
    });
  });
};

export default socketProducts;
