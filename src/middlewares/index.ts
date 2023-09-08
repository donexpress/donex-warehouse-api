import JWT from 'jsonwebtoken';
import { showRole } from '../context/role';
import { AppDataSource } from '../config/ormconfig';
import { Role } from '../models/role.model';

const guardianMw = (roles: string[]) => (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const object = decodeToken(token);

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

const decodeToken = (token) => {
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
    res.status(401).send('This user not access this request');
  }
};

const LoggerMiddleware = (req, res, next) => {
  console.log(`Logged  ${req.url}  ${req.method} -- ${new Date()}`);
  next();
};

const fetchcurrentUser = (req, res, next) => {
  const headers = req.headers;
  if (headers.hasOwnProperty('authorization')) {
    const token = req.headers.authorization.split(' ')[1];
    const object = decodeToken(token);

    if (!req.hasOwnProperty('assigns')) {
      req.assigns = {};
    }
    req.assigns.currentUser = object.data;
  }
  next();
};

const getCurrentUser = (req): string | null => {
  try {
    return req.assigns.currentUser;
  } catch (e) {
    return null;
  }
};

export {
  guardianMw,
  verifyTokenPresent,
  LoggerMiddleware,
  fetchcurrentUser,
  getCurrentUser,
};
