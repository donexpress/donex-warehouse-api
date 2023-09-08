import { Request, Response } from 'express';
import {
  countWarehouse,
  createWarehouse,
  listWarehouse,
  removeWarehouse,
  showWarehouse,
  updateWarehouse,
} from '../context/warehouse';
import { Warehouse } from '../models/warehouse.model';
import { getCurrentUser } from '../middlewares';

export const index = async (req: Request, res: Response) => {
  console.log(getCurrentUser(req));
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countWarehouse();
    const affiliations = await listWarehouse(current_page, number_of_rows);
    res.json(affiliations);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const affiliation = await showWarehouse(Number(req.params.id));
    if (!affiliation) {
      res.status(404).json(affiliation);
    } else {
      res.json(affiliation);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countWarehouse();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const body = req.body;
  const cargo_station = await createWarehouse(body);
  if (cargo_station instanceof Warehouse) {
    res.status(201).json(cargo_station);
    //@ts-ignore
  } else if (cargo_station.message) {
    res.status(409).json(cargo_station);
  } else {
    res.status(422).send(cargo_station);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateWarehouse(Number(req.params.id), req.body);
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
    const result = await removeWarehouse(Number(req.params.id));
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
