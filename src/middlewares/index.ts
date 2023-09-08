import JWT from 'jsonwebtoken';
import { showRole } from '../context/role';
import { AppDataSource } from '../config/ormconfig';
import { Role } from '../models/role.model';

const guardianMw = (roles: string[]) => (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const object = decode_token(token);

  AppDataSource.manager
    .find(Role, {
      where: {
        id: parseInt(object.data.role_id),
      },
    })
    .then((role) => {
      if (roles.includes(role[0].type)) {
        next();
      } else {
        res.status(403).send('Resource is forbidden to current role');
      }
    });
};

const decode_token = (token) => {
  try {
    return JWT.decode(token, { json: true });
  } catch (error) {
    return error;
  }
};

const verifyTokenPresent = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    req.user = decode_token(token);
    next();
  } else {
    res.status(401).send('This user not access this request');
  }
};

const LoggerMiddleware = (req, res, next) => {
  console.log(`Logged  ${req.url}  ${req.method} -- ${new Date()}`);
  next();
};

export { guardianMw, verifyTokenPresent, LoggerMiddleware };
