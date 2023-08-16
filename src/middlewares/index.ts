import JWT from "jsonwebtoken";

export const guardianMw = (token: string) => (req, res, next) => {};

const decode_token = (token) => {
  try {
    return JWT.decode(token, { json: true });
  } catch (error) {
    return error;
  }
};


export const verifyTokenPresent = () => (req, res, next) => {
    console.log(req);
}