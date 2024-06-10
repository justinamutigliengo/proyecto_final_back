import productsModel from "../models/products.model.js";

class ProductManager {
  constructor() {}

  async getProducts({ limit = 10, page = 1, sort = null, query = null }) {
    try {
      const queryOptions = {};
      if (query) {
        queryOptions.$or = [{ category: query }, { availability: query }];
      }

      let productsQuery = productsModel.find(queryOptions);

      if (sort === "asc" || sort === "desc") {
        productsQuery = productsQuery.sort({ price: sort === "asc" ? 1 : -1 });
      }

      const totalCount = await productsModel.countDocuments(queryOptions);
      const totalPages = Math.ceil(totalCount / limit);

      const products = await productsQuery
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      return {
        products,
        totalPages,
        page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };
    } catch (err) {
      throw err;
    }
  }
}

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

export default ProductManager;
