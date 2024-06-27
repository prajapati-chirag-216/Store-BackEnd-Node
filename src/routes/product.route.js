const express = require("express");
const catchAsync = require("../errors/catchAsync");
const ProductController = require("../controllers/product.controller");

const router = express.Router();

router.get("/getproduct/:id", catchAsync(ProductController.getProductHandler));

router.get(
  "/getAllProducts",
  catchAsync(ProductController.getAllProductsHandler)
);
router.get(
  "/getfilteredproducts/:window/:skip/:sortBy/:searchTxt",
  catchAsync(ProductController.getFilteredProductsHandler)
);

module.exports = router;
