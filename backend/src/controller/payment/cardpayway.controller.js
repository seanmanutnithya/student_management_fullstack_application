const {
  BakongKHQR,
  khqrData,
  IndividualInfo,
  SourceInfo,
} = require("bakong-khqr");
const stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();

const appUrl = "http://localhost:3000";
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { price } = req.body;
    const Data = {
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Visa PayWay Demo",
              description: "Testing payment by Stripe",
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/api/v1/cardpayway/Success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
    };

    const session = await stripeInstance.checkout.sessions.create(Data);

    res.json({
      message: "checkout session created successfully",
      url: session.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Unable to create checkout session. Check your Stripe keys and server logs.",
    });
  }
};
const getSessionDetails = async (sessionId) => {
  const session = await stripeInstance.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent.payment_method"],
  });
  return {
    id: session.id,
    amount_total: session.amount_total,
    currency: session.currency,
    payment_status: session.payment_status,
    customer_email: session.customer_details?.email || null,
    card_brand: session.payment_intent?.payment_method?.card?.brand || null,
    last4: session.payment_intent?.payment_method?.card?.last4 || null,
  };
};
const paymentSuccess = async (request, response) => {
  const sessionId = request.query.session_id;
  if (!sessionId) {
    return response.status(400).json({ error: "Missing session_id." });
  }
  try {
    const data = await getSessionDetails(sessionId);
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(404).json({ error: "Checkout session not found." });
  }
};

// handle create qr payment

const generateKHQR = async (req, res) => {
  const { amount, currency, billNumber } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({
      sucess: false,
      message: "Amount is required and must be greater than 0",
    });
  }
  const BAKONG_ACCOUNT_ID = process.env.BAKONG_ACCOUNT_ID;
  const ACCOUNT_NAME = process.env.MERCHANT_NAME;
  const MERCHANT_CITY = process.env.MERCHANT_CITY;

  const qrCurrency =
    currency === "KHR" ? khqrData.currency.khr : khqrData.currency.usd;

  const optionalData = {
    currency: qrCurrency,
    amount: parseFloat(amount),
    billNumber: billNumber,
    mobileNumber: process.env.MERCHANT_PHONE,
    storeLabel: process.env.STORE_LABEL,
    terminalLabel: "POS-T1",
    expirationTimestamp: Date.now() + 5 * 60 * 1000,
  };

  const individualInfo = new IndividualInfo(
    BAKONG_ACCOUNT_ID,
    ACCOUNT_NAME,
    MERCHANT_CITY,
    optionalData,
  );
  const khqr = new BakongKHQR();
  const response = khqr.generateIndividual(individualInfo);

  if (response && response.data) {
    // response.data.qr contains the EMV-compliant KHQR string
    // This string can be encoded into a QR code image for customers to scan
    // with any Bakong-supported banking app (ABA, Wing, ACLEDA, etc.)
    return res.status(200).json({
      success: true,
      data: {
        qr: response.data.qr, // The KHQR string to encode as QR image
        md5: response.data.md5, // MD5 hash for verification
        merchantName: ACCOUNT_NAME,
        currency: currency || "USD",
        amount: parseFloat(amount),
      },
      message: "KHQR generated successfully",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Failed to generate KHQR",
  });
};
module.exports = { createCheckoutSession, paymentSuccess, generateKHQR };
