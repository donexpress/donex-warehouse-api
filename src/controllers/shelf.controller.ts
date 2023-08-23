import { Request, Response } from 'express';
import {} from '../context/shelf_type';
import {
  countShelf,
  createShelf,
  listShelf,
  removeShelf,
  showShelf,
  updateShelf,
} from '../context/shelf';
import { Shelf } from '../models/shelf.model';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countShelf();
    const states = await listShelf(current_page, number_of_rows);
    res.json(states);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const result = await showShelf(Number(req.params.id));
    if (!result) {
      res.status(404).json(result);
    } else {
      res.json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countShelf();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await createShelf(req.body);
    if (result instanceof Shelf) {
      res.status(201).json(result);
    } else {
      res.status(422).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateShelf(Number(req.params.id), req.body);
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

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeShelf(Number(req.params.id));
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
