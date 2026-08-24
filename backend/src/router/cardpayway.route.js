const {
  createCheckoutSession,
  paymentSuccess,
  generateKHQR,
  verifyKHQR,
} = require("../controller/payment/cardpayway.controller");

const cardpaywayRoute = (app) => {
  app.post("/api/v1/cardpayway/stripe", createCheckoutSession);
  app.post("/api/v1/cardpayway/Success", paymentSuccess);

  //k KHQR Route
  app.post("/api/v1/cardpayway/verify", verifyKHQR);
  app.post("/api/v1/cardpayway/generate-khqr", generateKHQR);
};

module.exports = cardpaywayRoute;
