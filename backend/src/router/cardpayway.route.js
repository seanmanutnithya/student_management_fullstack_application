const {
  createCheckoutSession,
  paymentSuccess,
  generateKHQR,
} = require("../controller/payment/cardpayway.controller");

const cardpaywayRoute = (app) => {
  app.post("/api/v1/cardpayway/stripe", createCheckoutSession);
  app.post("/api/v1/cardpayway/Success", paymentSuccess);

  app.post("/api/v1/cardpayway/khqr", generateKHQR);
};

module.exports = cardpaywayRoute;
