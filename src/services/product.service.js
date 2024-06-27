const Product = require("../model/product.modal");

const ProductServices = {
  async getAllProductsHandler() {
    const data = await Product.find({ isDeleted: false }).select({ __v: 0 });
    return data;
  },

  async searchProductHandler(searchName) {
    const searchNameWithoutSpaces = searchName.replace(/\s/g, "");
    const data = await Product.find({
      name: new RegExp(searchNameWithoutSpaces.split("").join(".*"), "i"),
      isDeleted: false,
    });
    return data;
  },

  // sorting products with applied search and filter
  async sortProductWithSearchHandler(
    windowSize,
    skipRecords,
    searchTxt,
    sortBy
  ) {
    if (searchTxt !== "all") {
      const searchResults = await this.searchProductHandler(searchTxt);
      const data = await Product.find({
        _id: { $in: searchResults.map((product) => product._id) },
      })
        .sort(sortBy)
        .skip(skipRecords)
        .limit(windowSize + 1);
      return data;
    }
    const data = await Product.find({ isDeleted: false })
      .sort(sortBy)
      .skip(skipRecords)
      .limit(windowSize + 1);
    return data;
  },

  async getProductHandler(id) {
    const data = await Product.findOne({ _id: id, isDeleted: false });

    return data;
  },

  async getFilteredProductsHandler(windowSize, skipRecords, sortBy, searchTxt) {
    let data;
    if (sortBy === "sortByHighPrice") {
      data = await this.sortProductWithSearchHandler(
        windowSize,
        skipRecords,
        searchTxt,
        { price: -1 }
      );
    } else if (sortBy === "sortByLowPrice") {
      data = await this.sortProductWithSearchHandler(
        windowSize,
        skipRecords,
        searchTxt,
        { price: 1 }
      );
    } else if (sortBy === "sortByNewDate") {
      data = await this.sortProductWithSearchHandler(
        windowSize,
        skipRecords,
        searchTxt,
        { createdAt: -1 }
      );
    } else if (sortBy === "sortByOldDate") {
      data = await this.sortProductWithSearchHandler(
        windowSize,
        skipRecords,
        searchTxt,
        { createdAt: 1 }
      );
    }
    if (!data) {
      throw { message: "Somthing went wrong!" };
    }
    if (data.length > windowSize) {
      return { products: data.slice(0, windowSize), haveMore: true };
    }
    return { products: data, haveMore: false };
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
