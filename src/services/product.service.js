const Product = require("../model/product.modal");

const ProductServices = {
  async getAllProductsHandler() {
    const data = await Product.find({ isDeleted: false })
      .sort({ createdAt: 1 })
      .select({ __v: 0 });
    return data;
  },

  async searchProductHandler(searchName) {
    const searchNameWithoutSpaces = searchName.replace(/\s/g, "");
    const data = await Product.find({
      name: new RegExp(searchNameWithoutSpaces.split("").join(".*"), "i"),
    });
    return data;
  },

  async getProductHandler(id) {
    const data = await Product.findOne({ _id: id, isDeleted: false });

    return data;
  },

  async getFilteredProductsHandler(id, name) {
    let data;
    if (name === "sortByHighPrice") {
      data = await Product.find({ isDeleted: false }).sort({
        price: -1,
      });
    } else if (name === "sortByLowPrice") {
      data = await Product.find({ isDeleted: false }).sort({
        price: 1,
      });
    } else if (name === "sortByNewDate") {
      data = await Product.find({ isDeleted: false }).sort({
        createdAt: -1,
      });
    } else if (name === "sortByOldDate") {
      data = await Product.find({ isDeleted: false }).sort({
        createdAt: 1,
      });
    }

    if (!data) {
      throw { message: "Somthing went wrong!" };
    }
    return data;
  },

  async checkProductsQuantityHandler(productData) {
    await Promise.all(
      productData.map(async (product) => {
        const data = await Product.findById(product.productId);
        if (data && data.quantity < product.quantity) {
          throw {
            message: "one or more items does not have sufficient quantity.",
            status: 404,
          };
        }
      })
    );
    // const data = Product.find({ id: { $in: productIds } });
    return { success: true };
  },

  async updateProductsQuantityHandler(productData) {
    await Promise.all(
      productData.map(async (product) => {
        const updatedProduct = await Product.findByIdAndUpdate(
          product.productId,
          { $inc: { quantity: -product.quantity } },
          { new: true }
        );

        if (!updatedProduct || updatedProduct.quantity < 0) {
          throw {
            message: "one or more items does not have sufficient quantity.",
            status: 404,
          };
        }
      })
    );
    return { success: true };
  },
};

module.exports = ProductServices;
