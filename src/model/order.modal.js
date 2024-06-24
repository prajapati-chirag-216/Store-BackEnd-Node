const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    contactInformation: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw { message: "Enter valid email .." };
          }
        },
        required: true,
      },
      phoneNo: {
        type: String,
        required: true,
      },
    },

    shippingAddress: {
      country: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pinCode: {
        type: String,
        required: true,
      },
    },
    shippingMethod: {
      type: String,
      required: true,
    },
    deliveryStatus: {
      type: String,
      default: "Pending",
      required: true,
    },
    orderedItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);
