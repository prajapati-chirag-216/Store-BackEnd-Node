const UserServices = require("../services/user.service");
const {
  setUserAccessTokenCookie,
  setUserRefreshTokenCookie,
} = require("../utils/function");

const UserController = {
  async signupUserHandler(req, res) {
    const { accessToken, refreshToken } = await UserServices.signupUserHandler(
      req.body
    );
    setUserAccessTokenCookie(res, accessToken);
    setUserRefreshTokenCookie(res, refreshToken);
    res.status(200).send({ success: true });
  },

  async loginUserHandler(req, res) {
    const { accessToken, refreshToken, cartItems } =
      await UserServices.loginUserHandler(req.body.email, req.body.password);
    setUserAccessTokenCookie(res, accessToken);
    setUserRefreshTokenCookie(res, refreshToken);
    res.status(200).send({
      success: true,
      cartItems,
    });
  },

  logoutUserHandler(req, res) {
    res.clearCookie("userRefreshToken", { secure: true, sameSite: "None" });
    res.clearCookie("userAccessToken", { secure: true, sameSite: "None" });
    res.status(200).send({ success: true });
  },

  async forgotPasswordHandler(req, res) {
    const resetToken = await UserServices.forgotPasswordHandler(req.body.email);
    res.status(200).send({ success: true, resetToken });
  },

  async resetPasswordHandler(req, res) {
    await UserServices.resetPasswordHandler(req.params.id);
    res.status(200).send({ status: true });
  },

  async getUserHandler(req, res) {
    res.status(200).send(req.user || null);
  },

  async addCartItemsHandler(req, res) {
    const userData = req.user;
    const cartData = req.body;
    const cartItems = await UserServices.addCartItemsHandler(
      userData,
      cartData
    );
    res.status(200).send({ success: true, cartItems });
  },

  async getAccessTokenHandler(req, res) {
    const accessToken = await UserServices.getAccessTokenHandler(req.user);
    setUserAccessTokenCookie(res, accessToken);
    res.status(200).send({
      success: true,
    });
  },
};

module.exports = UserController;
