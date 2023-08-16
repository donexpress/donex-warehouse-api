import JWT from "jsonwebtoken";

const guardianMw = (token: string) => (req, res, next) => {};

const decode_token = (token) => {
  try {
    return JWT.decode(token, { json: true });
  } catch (error) {
    return error;
  }
};

const verifyTokenPresent = (req, res, next) => {
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).send("This user not access this request");
  }
};

const LoggerMiddleware = (req, res, next) => {
  console.log(`Logged  ${req.url}  ${req.method} -- ${new Date()}`);
  next();
};

export { guardianMw, verifyTokenPresent, LoggerMiddleware };
