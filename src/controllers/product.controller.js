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
    const string = req.params.name;
    const catId = req.params.id;

    const data = await ProductServices.getFilteredProductsHandler(
      catId,
      string
    );
    res.status(200).send(data);
  },
};

module.exports = ProductController;
