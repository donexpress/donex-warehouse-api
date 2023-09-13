import { Request, Response } from 'express';
import { countAppendix, createAppendix, getAppendagesByOutputPlan, listAppendix, removeAppendix, showAppendix, updateAppendix } from '../context/appendix';
import { Appendix } from '../models/appendix.model';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countAppendix();

    const query = req.query.query;
    const organization = await listAppendix(
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
    const organization = await showAppendix(Number(req.params.id));
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
    const count = await countAppendix();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const aosWarehouse = await createAppendix(req.body);
  if (aosWarehouse instanceof Appendix) {
    res.status(201).json(aosWarehouse);
  } else {
    res.status(422).json(aosWarehouse);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateAppendix(Number(req.params.id), req.body);
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
    const result = await removeAppendix(Number(req.params.id));
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

export const byExitPLan = async(req: Request, res: Response) => {
    try {
        const id =  req.params.id ? Number(req.params.id) : -1
        const result = await getAppendagesByOutputPlan(id)
        res.status(200).json(result)
    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
}
