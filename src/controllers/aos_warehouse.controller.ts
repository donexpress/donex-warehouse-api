import { Request, Response } from 'express';
import {
  countAOSWarehouse,
  createAOSWarehouse,
  listAOSWarehouse,
  removeAOSWarehouse,
  showAOSWarehouse,
  updateAOSWarehouse,
} from '../context/aos_warehouse';
import { AOSWarehouse } from '../models/aos_warehouse.model';
import { UpdateResult } from 'typeorm';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countAOSWarehouse();

    const query = req.query.query;
    const organization = await listAOSWarehouse(
      current_page,
      number_of_rows,
      query == undefined ? '' : String(query)
    );
    res.json(organization);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const organization = await showAOSWarehouse(Number(req.params.id));
    if (!organization) {
      res.status(404).json(organization);
    } else {
      res.json(organization);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countAOSWarehouse();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const aosWarehouse = await createAOSWarehouse(req.body);
  if (aosWarehouse instanceof AOSWarehouse) {
    res.status(201).json(aosWarehouse);
  } else if (aosWarehouse.message) {
    res.status(409).json(aosWarehouse);
  } else {
    res.status(422).json(aosWarehouse);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateAOSWarehouse(Number(req.params.id), req.body);
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
    const result = await removeAOSWarehouse(Number(req.params.id));
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
