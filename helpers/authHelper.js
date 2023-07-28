const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const accessToken = (payload) => new Promise((resolve, reject) => {
  const secret = process.env.JWT_KEY;
  JWT.sign(payload, secret, { expiresIn: "6h" }, (err, token) => {
    if (err) {
      reject(err.message);
      return;
    }
    resolve(token);
  });
});

const mustBeLoggedIn = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers.authorization || req.body.token;
  // Express headers are auto converted to lowercase
  if (token && token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length).replace(/"/g, '').trimLeft();
  }
  try {
    req.apiUser = JWT.verify(token, process.env.JWT_KEY);
    res.locals.user = req.apiUser;

    // res.locals is guaranteed to hold state over the life of a request.
    next();
  } catch (error) {
    var log = req.headers
    res.status(401).json({
      status: false,
      log,
      message: "Sorry, you must provide a valid token."
    });
  }
};

const isPasswordValid = (hashedPass, plainPass) => bcrypt.compareSync(plainPass, hashedPass);

module.exports = { accessToken, mustBeLoggedIn, isPasswordValid };
