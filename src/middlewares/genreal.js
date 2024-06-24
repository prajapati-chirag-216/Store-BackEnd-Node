const { adminAuth } = require("./auth");

function allowUnauthenticated(role) {
  return (req, res, next) => {
    const { origin } = req.headers;
    if (origin === "http://localhost:5000") {
      return next();
    } else {
      adminAuth(role)(req, res, next).catch((error) => {
        next(error);
      });
    }
  };
}

module.exports = allowUnauthenticated;
