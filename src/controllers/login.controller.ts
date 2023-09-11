import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Staff } from '../models/staff.model';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

const getUserRepositoryData = async (service) => {
  const repository =
    service === 'wms'
      ? await AppDataSource.getRepository(Staff)
      : await AppDataSource.getRepository(User);

  return repository;
};

export const login = async (req: Request, res: Response) => {
  const warehouse_service = req.headers.warehouse_service;
  const repository = await getUserRepositoryData(warehouse_service);

  const user = await repository.findOne({
    where: { username: req.body.username, state: "normal" },
  });
  // Not login if you take this values
  if (["resign", "frezze"].includes(user.state)) {
    res.status(401).json({
      message: 'We have a problem with this user. Please contact an administrator for a solution.',
    });
  }

  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    res.status(401).json({
      message: 'User or password incorrect',
    });
  } else {
    delete user.password;
    const token = JWT.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        data: user,
      },
      process.env.SECRET
    );
    res.send({ token });
  }
};

export const self = async (req: Request, res: Response) => {
  //const warehouse_service = req.headers.warehouse_service;
  //@ts-ignore
  const user = req.assigns.currentUser;

  const role = await AppDataSource.getRepository(Role).findOne({
    where: {
      id: user.role_id,
    },
  });
  delete user.password;

  res.send({ ...user, role });
};
