const express = require("express");
const {
  auth,
  verifyUser,
  verifyRefreshToken,
} = require("../middlewares/userAuth");
const catchAsync = require("../errors/catchAsync");
const router = express.Router();

const UserController = require("../controllers/user.controller");

router.get(
  "/user/profile",
  catchAsync(verifyUser),
  catchAsync(UserController.getUserHandler)
);

router.post("/user/signup", catchAsync(UserController.signupUserHandler));
router.post("/user/login", catchAsync(UserController.loginUserHandler));
router.post(
  "/user/logout",
  catchAsync(auth),
  catchAsync(UserController.logoutUserHandler)
);

// we will add these feature in future
// router.post(
//   "/user/forgotPassword",
//   catchAsync(UserController.forgotPasswordHandler)
// );
// router.post(
//   "/user/resetPassword/:id",
//   catchAsync(UserController.resetPasswordHandler)
// );

router.post(
  "/addCartItems",
  catchAsync(auth),
  catchAsync(UserController.addCartItemsHandler)
);

router.get(
  "/user/getAccessToken",
  catchAsync(verifyRefreshToken),
  catchAsync(UserController.getAccessTokenHandler)
);

module.exports = router;
