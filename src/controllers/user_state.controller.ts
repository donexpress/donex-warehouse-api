import { Request, Response } from 'express';
import states from '../config/states';

export const index = async (req: Request, res: Response) => {
  res.json(states.user);
};
