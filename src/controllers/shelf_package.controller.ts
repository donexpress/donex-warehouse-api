import { Request, Response } from 'express';
import {} from '../context/shelf_type';
import { countShelfPackages, createShelfPackages, listShelfPackages, removeShelfPackages, showShelfPackage, updateShelfPackages } from '../context/shelf_package';
import { Shelf } from '../models/shelf.model';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countShelfPackages();
    const states = await listShelfPackages(current_page, number_of_rows);
    res.json(states);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const result = await showShelfPackage(Number(req.params.id));
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
    const count = await countShelfPackages();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await createShelfPackages(req.body);
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
    const result = await updateShelfPackages(Number(req.params.id), req.body);
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
    const result = await removeShelfPackages(Number(req.params.id));
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
