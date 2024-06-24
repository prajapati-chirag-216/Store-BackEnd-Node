const express = require("express");
const catchAsync = require("../errors/catchAsync");
const ProductController = require("../controllers/product.controller");

const router = express.Router();

router.get("/getproduct/:id", catchAsync(ProductController.getProductHandler));

router.get(
  "/getAllproducts",
  catchAsync(ProductController.getAllProductsHandler)
);

router.get(
  "/searchProduct/:name",
  catchAsync(ProductController.searchProductHandler)
);

router.get(
  "/getfilteredproducts/:id/:name",
  catchAsync(ProductController.getFilteredProductsHandler)
);

module.exports = router;
