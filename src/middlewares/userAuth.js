const jwt = require("jsonwebtoken");
const User = require("../model/user.modal");
const status = require("http-status");

const auth = async (req, res, next) => {
  try {
    const accessToken = req.cookies["userAccessToken"];
    const refreshToken = req.cookies["userRefreshToken"];
    let data;
    if (refreshToken) {
      let accessTokenDecoded;
      if (accessToken) {
        accessTokenDecoded = jwt.verify(
          accessToken,
          process.env.USER_ACCESS_TOKEN_SECRET
        );
      }
      const refreshTokenDecoded = jwt.verify(
        refreshToken,
        process.env.USER_REFRESH_TOKEN_SECRET
      );
      if (
        accessTokenDecoded &&
        refreshTokenDecoded &&
        accessTokenDecoded._id === refreshTokenDecoded._id
      ) {
        data = await User.findOne({
          _id: accessTokenDecoded._id,
        });
        req.user = data;
      } else if (refreshTokenDecoded) {
        throw {
          status: status.FORBIDDEN,
          message: "invalid access",
        };
      }
    } else {
      throw {
        status: status.UNAUTHORIZED,
        message: "unAuthorized access",
      };
    }
    next();
  } catch (err) {
    res.status(err.status || 404).send(err.message || "somthing went wrong!");
  }
};
const verifyUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies["userAccessToken"];
    const refreshToken = req.cookies["userRefreshToken"];
    let data;
    if (refreshToken) {
      let accessTokenDecoded;
      if (accessToken) {
        accessTokenDecoded = jwt.verify(
          accessToken,
          process.env.USER_ACCESS_TOKEN_SECRET
        );
      }
      const refreshTokenDecoded = jwt.verify(
        refreshToken,
        process.env.USER_REFRESH_TOKEN_SECRET
      );
      if (
        accessTokenDecoded &&
        refreshTokenDecoded &&
        accessTokenDecoded._id === refreshTokenDecoded._id
      ) {
        data = await User.findOne({
          _id: accessTokenDecoded._id,
        });
        req.user = data;
      } else if (refreshTokenDecoded) {
        throw {
          status: status.FORBIDDEN,
          message: "invalid access",
        };
      }
    } else {
      req.user = data;
    }
    next();
  } catch (err) {
    res.status(err.status || 404).send(err.message || "somthing went wrong");
  }
};
const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["userRefreshToken"];
    let data;
    if (refreshToken) {
      const refreshTokenDecoded = jwt.verify(
        refreshToken,
        process.env.USER_REFRESH_TOKEN_SECRET
      );
      if (refreshTokenDecoded) {
        data = await User.findOne({
          _id: refreshTokenDecoded._id,
        });
        req.user = data;
      }
    } else {
      throw {
        status: status.FORBIDDEN,
        message: "anAuthorized access",
      };
    }
    next();
  } catch (err) {
    res.status(err.status || 404).send(err.message || "Somthing Went Wrong!");
  }
};
module.exports = { auth, verifyUser, verifyRefreshToken };
