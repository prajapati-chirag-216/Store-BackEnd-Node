const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// routers for all 3 collections
const productRouter = require("./routes/product.route");
const userRouter = require("./routes/user.route");
const orderRouter = require("./routes/order.route");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(userRouter);
app.use(productRouter);
app.use(orderRouter);

app.use((err, req, res, next) => {
  let errorCode = 500;
  let errorMessage = "Internal Server Error!";
  if (err.code == 11000 && err.keyPattern) {
    err.message = `Record already exists with the same ${Object.keys(
      err.keyPattern
    )}`;
    errorCode = 409;
  }
  console.log("err ", err);
  res.status(err.status || errorCode).send({
    message: err.message || errorMessage,
  });
});

module.exports = app;
