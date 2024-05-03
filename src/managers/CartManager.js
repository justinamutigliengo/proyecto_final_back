import fs from "fs";
import ProductManager from "./ProductManager.js";

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  getCarts = async () => {
    if (fs.existsSync(this.path)) {
      const cartList = await fs.promises.readFile(this.path, "utf-8");
      const cartListParse = JSON.parse(cartList);
      return cartListParse;
    } else {
      return [];
    }
  };

  getCartbyId = async (objparams) => {
    const { cid } = objparams;
    try {
      if (fs.existsSync(this.path)) {
        const allCarts = await this.getCarts();
        const found = allCarts.find((element) => element.id === parseInt(cid));
        if (found) {
          return found;
        } else {
          return "cart no existe";
        }
      } else {
        return "cart file json  not found";
      }
    } catch (error) {
      return error;
    }
  };

  generatecartId = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const cartList = await fs.promises.readFile(this.path, "utf-8");
        const cartListJs = JSON.parse(cartList);
        const counter = cartListJs.length;
        if (counter == 0) {
          return 1;
        } else {
          return cartListJs[counter - 1].id + 1;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  addCart = async () => {
    const listaCarts = await this.getCarts();
    const id = await this.generatecartId();
    const cartNew = {
      id,
      products: [],
    };
    listaCarts.push(cartNew);
    await fs.promises.writeFile(this.path, JSON.stringify(listaCarts));
  };

  addProductToCart = async (cid, pid) => {
    const listaCarts = await this.getCarts();
    const cart = listaCarts.find((e) => e.id === cid);
    const productIndex = cart.products.findIndex((p) => p.pid === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({
        pid,
        quantity: 1,
      });
    }

    await fs.promises.writeFile(this.path, JSON.stringify(listaCarts));
  };
}

export default CartManager;
