import { Request, Response } from 'express';
import {
  countUserState,
  createUserState,
  listUserState,
  removeUserState,
  showUserState,
  updateUserState,
} from '../context/userState';
import { UserState } from '../models/user_state.model';
import states from '../config/states';

export const index = async (req: Request, res: Response) => {
  res.json(states.user);
};

/* export const show = async (req: Request, res: Response) => {
  try {
    const role = await showUserState(Number(req.params.id));
    res.json(role);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countUserState();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const user_state = await createUserState(req.body);
  if (user_state instanceof UserState) {
    res.status(201).json(user_state);
  } else {
    res.status(422).json(user_state);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateUserState(Number(req.params.id), req.body);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeUserState(Number(req.params.id));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}; */
