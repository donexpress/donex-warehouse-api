import { Request, Response } from 'express';
import {
  countUser,
  createUser,
  listUser,
  removeUser,
  showUser,
  updateUser,
} from '../context/user';
import { User } from '../models/user.model';
import { UpdateResult } from 'typeorm';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countUser();
    const query = req.query.query;
    const state = req.query.state;
    const users = await listUser(
      current_page,
      number_of_rows,
      query == undefined ? '' : String(query),
      state == undefined ? '' : String(state)
    );
    res.json(users);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const user = await showUser(Number(req.params.id));
    if (!user) {
      res.status(404).send(null);
    } else {
      res.json(user);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countUser();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const body = req.body;
  const user = await createUser(body);
  console.log(user);
  if (user instanceof User) {
    res.status(201).json(user);
    //@ts-ignore
  } else if (user.message) {
    res.status(409).json(user);
  } else {
    return res.status(422).json(user);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateUser(Number(req.params.id), req.body);
    if (result instanceof UpdateResult) {
      if (result.affected === 0) {
        res.status(404).json(result);
      } else {
        res.status(200).json(result);
      }
    } else {
      res.status(409).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeUser(Number(req.params.id));
    if (result.affected === 0) {
      res.status(404).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
