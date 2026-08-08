const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const validate_token = () => {
  const secret_token = process.env.SECRET_TOKEN;
  return (req, res, next) => {
    const authorization = req.headers.authorization;
    let client_token = null;

    if (authorization != "" && authorization != null) {
      client_token = authorization.split(" ")[1];
    }
    if (client_token == null) {
      res.status(404).send({
        status: false,
        message: "unauthorized client_token",
      });
    } else {
      jwt.verify(client_token, secret_token, (error, result) => {
        if (error) {
          res.status(404).send({
            status: false,
            message: error,
          });
        } else {
          ((req.user = result), next());
        }
      });
    }
  };
};

module.exports = validate_token;
