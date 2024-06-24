const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const status = require("http-status");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [5, "Name should contain at least 5 characters .."],
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: [true, "Enter valid email please .."],
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw { message: "Enter valid email .." };
          // throw new Error("Enter valid email ..");
        }
      },
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: [6, "Enter valid password .."],
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject(); // this will return a clone object so we can delete from that
  delete user.password;
  return user;
};

userSchema.methods.createResetToken = function () {
  const resettoken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 5 * 60 * 1000; // expires in 5 min
  return resettoken;
};

userSchema.methods.getAuthToken = function () {
  const user = this;
  const accessToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.USER_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m", // in case it takes some seconds delay
    }
  );
  const refreshToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.USER_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "2d", // in case it takes some seconds delay
    }
  );
  return { accessToken, refreshToken };
};
userSchema.methods.getAccessToken = function () {
  const user = this;
  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.USER_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m", // in case it first expires
    }
  );
  return accessToken;
};

userSchema.statics.findbyCredentials = async function (email, password) {
  const user = await User.findOne({ email })
    .populate("cartItems.product")
    .select({ password: 1, cartItems: 1 });
  if (user == null) {
    throw {
      status: status.UNAUTHORIZED,
      message: "Invalid login details",
    };
  }
  const compare = await bcrypt.compare(password, user.password);
  if (!compare) {
    throw {
      status: status.UNAUTHORIZED,
      message: "Invalid password",
    };
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const User = mongoose.model("user", userSchema);

module.exports = User;
