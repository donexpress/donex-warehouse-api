import { Request, Response } from 'express';
import {
  countUserLevel,
  createUserLevel,
  listUserLevel,
  removeUserLevel,
  showUserLevel,
  updateUserLevel,
} from '../context/user_level';
import { UserLevel } from '../models/user_level.model';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countUserLevel();
    const organization = await listUserLevel(current_page, number_of_rows);
    res.json(organization);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const organization = await showUserLevel(Number(req.params.id));
    res.json(organization);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countUserLevel();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const user_level = await createUserLevel(req.body);
  if(user_level instanceof UserLevel) {
    res.status(201).json(user_level);
  } else {
    res.status(422).json(user_level)
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateUserLevel(Number(req.params.id), req.body);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeUserLevel(Number(req.params.id));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
