const ProductServices = require("../services/product.service");

const ProductController = {
  async getProductHandler(req, res) {
    const data = await ProductServices.getProductHandler(req.params.id);
    res.status(200).send(data);
  },

  async getAllProductsHandler(req, res) {
    const data = await ProductServices.getAllProductsHandler();
    res.status(200).send(data);
  },

  async searchProductHandler(req, res) {
    const data = await ProductServices.searchProductHandler(req.params.name);
    res.status(200).send(data);
  },

  async getFilteredProductsHandler(req, res) {
    const windowSize = req.params?.window || 10;
    const skip = (req.params?.skip || 0) * windowSize;
    const sortBy = req.params?.sortBy || "sortByNewDate";
    const searchTxt = req.params?.searchTxt || "all";

    const data = await ProductServices.getFilteredProductsHandler(
      windowSize,
      skip,
      sortBy,
      searchTxt
    );
    res.status(200).send(data);
  },
};

module.exports = ProductController;
