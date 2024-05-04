import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  getNextId = () => this.products.length + 1;

  addProduct = async ({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  }) => {
    if (!title || !description || !price || !code || !stock) {
      console.error("Todos los campos son requeridos");
      return;
    }

    const isCodeDuplicate = this.products.some(
      (product) => product.code === code
    );
    if (isCodeDuplicate) {
      console.error(`El código ${code} está repetido`);
      return;
    }

    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: this.getNextId(),
    };

    this.products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
  };

  readProducts = async () => {
    let response = await fs.promises.readFile(this.path, "utf-8");

    return response ? JSON.parse(response) : [];
  };

  getProducts = async (limit) => {
    const products = await fs.promises.readFile(this.path, "utf-8");
    const parsedProducts = await JSON.parse(products);
    this.products = parsedProducts;

    return limit === 0 ? parsedProducts : parsedProducts.slice(0, limit);
  };

  getProductById = async (id) => {
    const products = await fs.promises.readFile(this.path, "utf-8");
    const parsedProducts = await JSON.parse(products);
    this.products = parsedProducts;

    const product = this.products.find((product) => product.id === +id) || {};
    return product;
  };

  updateProduct = async (objparams, objbody) => {
    const { pid } = objparams;
    const {
      title,
      description,
      price,
      category,
      thumbnail,
      status,
      code,
      stock,
    } = objbody;
    if (
      title === undefined ||
      description === undefined ||
      price === undefined ||
      category === undefined ||
      status === undefined ||
      code === undefined ||
      stock === undefined
    ) {
      console.error(
        "Ingrese todos los datos del producto para su actualización"
      );
      return;
    } else {
      const listadoProductos = await this.getProducts({});
      const codigorepetido = listadoProductos.find((i) => i.code === code);
      if (codigorepetido) {
        console.error(
          "El código del producto que desea actualizar es repetido"
        );
        return;
      } else {
        const listadoProductos = await this.getProducts({});
        const newProductsList = listadoProductos.map((elemento) => {
          if (elemento.id === parseInt(pid)) {
            const updatedProduct = {
              ...elemento,
              title,
              description,
              price,
              category,
              status,
              thumbnail,
              code,
              stock,
            };
            return updatedProduct;
          } else {
            return elemento;
          }
        });
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(newProductsList, null, 2)
        );
      }
    }
  };

  deleteProduct = async (objparams) => {
    const { pid } = objparams;
    const allproducts = await this.getProducts({});
    const productswithoutfound = allproducts.filter(
      (elemento) => elemento.id !== parseInt(pid)
    );
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productswithoutfound, null, 2)
    );
  };
}

export default ProductManager;

// productManager.addProduct(
//   "Producto 1",
//   "Descripción 1",
//   1000,
//   "imagen1.jpg",
//   "abc123",
//   10
// );

// productManager.addProduct(
//   "Producto 2",
//   "Descripción 2",
//   2000,
//   "imagen2.jpg",
//   "def456"
// );

// productManager.addProduct(
//   "Producto 3",
//   "Descripción 3",
//   3000,
//   "imagen3.jpg",
//   "ghi789",
//   5
// );

// productManager.addProduct(
//   "Producto 4",
//   "Descripción 4",
//   3500,
//   "imagen4.jpg",
//   "jyt739",
//   12
// );

// productManager.addProduct(
//   "Producto 5",
//   "Descripción 5",
//   1200,
//   "imagen5.jpg",
//   "oqs749",
//   5
// );

// productManager.addProduct(
//   "Producto 6",
//   "Descripción 6",
//   3050,
//   "imagen6.jpg",
//   "fry729",
//   4
// );

// productManager.addProduct(
//   "Producto 7",
//   "Descripción 7",
//   5200,
//   "imagen7.jpg",
//   "ghi589",
//   5
// );

// productManager.addProduct(
//   "Producto 8",
//   "Descripción 8",
//   3000,
//   "imagen8.jpg",
//   "iut787",
//   5
// );

// productManager.addProduct(
//   "Producto 9",
//   "Descripción 9",
//   3450,
//   "imagen9.jpg",
//   "tui740",
//   15
// );

// productManager.addProduct(
//   "Producto 10",
//   "Descripción 10",
//   2700,
//   "imagen10.jpg",
//   "ghi475",
//   20
// );

// productManager.getProducts();

// productManager.getProductById(1);
// productManager.getProductById(4);

// productManager.deleteProduct(1);

// productManager.updateProduct({
//   title: "Producto 1",
//   description: "Descripción 1",
//   price: 1000,
//   thumbnail: "imagen1.jpg",
//   code: "abc123",
//   stock: 10,
//   id: 1,
// });

// const manager = new ProductManager("./Productos.json");
// await manager.addProduct(
//   "Producto 1",
//   "Descripción 1",
//   1000,
//   "imagen1.jpg",
//   "abc123",
//   10
// );
// console.log(await manager.getProducts(0));
