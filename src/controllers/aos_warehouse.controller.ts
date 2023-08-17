import { Request, Response } from "express";
import { countAOSWarehouse, createAOSWarehouse, listAOSWarehouse, removeAOSWarehouse, showAOSWarehouse, updateAOSWarehouse } from "../context/aos_warehouse";

export const index = async (req: Request, res: Response) => {
    try {
        const current_page = req.query.current_page
            ? Number(req.query.current_page)
            : 1;
        const number_of_rows = req.query.number_of_rows
            ? Number(req.query.number_of_rows)
            : await countAOSWarehouse();

        const query = req.query.query;
        const organization = await listAOSWarehouse(current_page, number_of_rows, query == undefined ? '' : String(query));
        res.json(organization);
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

export const show = async (req: Request, res: Response) => {
    try {
        const organization = await showAOSWarehouse(Number(req.params.id));
        res.json(organization);
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

export const count = async (req: Request, res: Response) => {
    try {
        const count = await countAOSWarehouse();
        res.json({ count });
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const organization = createAOSWarehouse(req.body);
        res.status(201).json(organization);
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const result = await updateAOSWarehouse(Number(req.params.id), req.body);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const result = await removeAOSWarehouse(Number(req.params.id));
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};
