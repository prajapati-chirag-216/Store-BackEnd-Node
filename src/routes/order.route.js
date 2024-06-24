const express = require("express");
const { auth } = require("../middlewares/userAuth");
const catchAsync = require("../errors/catchAsync");

const OrderController = require("../controllers/order.controller");

const router = express.Router();

router.get(
  "/getUserOrders",
  catchAsync(auth),
  OrderController.getUserOrdersHandler
);

router.get(
  "/getOrder/:id",
  catchAsync(auth),
  catchAsync(OrderController.getOrderByIdHandler)
);

router.post(
  "/postOrder",
  catchAsync(auth),
  catchAsync(OrderController.postOrderHandler)
);

module.exports = router;
