const { isValidObjectId } = require("mongoose");
const Order = require("../model/order.modal");
const User = require("../model/user.modal");

const OrderServices = {
  async postOrderHandler(orderData, userId) {
    const data = new Order(orderData);
    if (!data) {
      throw { message: "Order canceled" };
    }
    await data.save();
    await User.findByIdAndUpdate(
      { _id: userId },
      { cartItems: [] },
      { new: true }
    );
    return data;
  },

  async getOrderHandler(id) {
    const data = await Order.findById(id).populate("orderedItems.productId");
    if (!data) {
      throw { message: "Order not found" };
    }
    return data;
  },

  async getUserOrdersHandler(id) {
    const data = await Order.find({ userId: id }).populate(
      "orderedItems.productId"
    );

    return data;
  },
};

module.exports = OrderServices;
