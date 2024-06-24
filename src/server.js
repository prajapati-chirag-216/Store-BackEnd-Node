const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URL;

mongoose.connection.on("error", (err) => {
  console.error(err);
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Listning on ${PORT} ..`);
    });
  })
  .catch((err) => {
    console.log("Server error -> ", err);
  });
