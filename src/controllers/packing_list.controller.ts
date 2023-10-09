import { Request, Response } from 'express';
import {
  countPackingList,
  createPackingList,
  exist_expansion_number,
  getPackingListByCaseNumber,
  listPackingList,
  removePackingList,
  showPackingList,
  updatePackingList,
} from '../context/packing_list';
import { PackingList } from '../models/packing_list.model';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countPackingList();
    const query = req.query.query;
    const organization = await listPackingList(
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
    const result = await showPackingList(Number(req.params.id));
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
    const count = await countPackingList();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const result = await createPackingList(req.body);
  if(result == null) {
    res.status(401).json(result)
    return;
  }
  if (result instanceof PackingList) {
    res.status(201).json(result);
  } else {
    res.status(422).json(result);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updatePackingList(Number(req.params.id), req.body);
    if (!result || result.affected === 0) {
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
    const result = await removePackingList(Number(req.params.id));
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

export const getByCaseNumber =async (req:Request, res: Response) => {
  try {
    const query = req.query.case_number;
    const result = await getPackingListByCaseNumber(String(query));
    if (!result) {
      res.status(404).json(result);
    } else {
      res.json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export const existExpansionNumber =  async (req: Request, res: Response) => {
  const data: {expansion_number: string, storage_plan_id: number} = req.body;
  res.send(await exist_expansion_number(data.expansion_number, data.storage_plan_id))
}
