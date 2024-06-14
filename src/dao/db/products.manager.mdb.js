import productsModel from "../models/products.model.js";

class ProductManager {
  constructor() {}

  getProducts = async ({ limit = 10, page = 1, sort, query }) => {
    try {
      const filter = query ? { type: query } : {};
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
      };

      const result = await productsModel.paginate(filter, options);

      return result;
    } catch (err) {
      res
        .status(500)
        .send({ origin: config.SERVER, payload: null, error: err.message });
    }
  };

  getProductsView = async () => {
    try {
      return await productsModel.find().lean();
    } catch (err) {
      return err;
    }
  };

  getProductById = async (id) => {
    try {
      return await productsModel.findById(id);
    } catch (err) {
      return { error: err.message };
    }
  };

  addProduct = async (product) => {
    try {
      await productsModel.create(product);
      return await productsModel.findOne({ title: product.title });
    } catch (err) {
      return err;
    }
  };

  updateProduct = async (id, product) => {
    try {
      return await productsModel.findByIdAndUpdate(id, { $set: product });
    } catch (err) {
      return err;
    }
  };

  deleteProduct = async (id) => {
    try {
      return await productsModel.findByIdAndDelete(id);
    } catch (err) {
      return err;
    }
  };
}

export default ProductManager;
