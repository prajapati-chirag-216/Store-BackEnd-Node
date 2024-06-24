const User = require("../model/user.modal");
const status = require("http-status");

const UserServices = {
  async signupUserHandler(userData) {
    const data = await new User({ ...userData });
    const { accessToken, refreshToken } = data.getAuthToken();
    await data.save();
    // sendWelcomeEmail(data.email);
    return { accessToken, refreshToken };
  },

  async loginUserHandler(email, password) {
    const data = await User.findbyCredentials(email, password);
    const { accessToken, refreshToken } = await data.getAuthToken();
    // sendWelcomeEmail(data.email);

    return { accessToken, refreshToken, cartItems: data.cartItems };
  },

  async forgotPasswordHandler(email) {
    const data = await User.findOne(email);
    if (!data || data.length === 0) {
      throw {
        message: "No account exist with this E-mail Id",
        status: status.UNAUTHORIZED,
      };
    }
    const resetToken = data.createResetToken();
    await data.save({ validateBeforeSave: false });
    // here we can send email to user about reseting password
    return resetToken;
  },

  async resetPasswordHandler(id) {
    const hashedToken = crypto.createHash("sha256").update(id).digest("hex");
    const data = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!data || data.length === 0) {
      throw {
        message: "Session Time out! Please try again.",
        status: 440,
      };
    }
    data.password = password;
    data.passwordResetToken = undefined;
    data.passwordResetExpires = undefined;
    await data.save();
  },

  async addCartItemsHandler(userData, cartData) {
    let cartItems = [];
    const processCartItems = () => {
      return new Promise((resolve, reject) => {
        for (let key in cartData) {
          cartItems.push({
            product: cartData[key]._id,
            quantity: cartData[key].quantity,
          });
        }
        resolve();
      });
    };
    await processCartItems();
    userData.cartItems = cartItems;
    await userData.save();
    return cartItems;
  },

  async getAllUsersHandler() {
    const data = await User.find();
    return data;
  },

  async getAccessTokenHandler(user) {
    const accessToken = await user.getAccessToken();
    return accessToken;
  },
};

module.exports = UserServices;
