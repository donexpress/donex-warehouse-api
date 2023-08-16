import { Request, Response } from "express";
import { countWarehouse, createWarehouse, listWarehouse, removeWarehouse, showWarehouse, updateWarehouse } from "../context/warehouse";

export const index = async (req: Request, res: Response) => {
    try {
        const current_page = req.query.current_page ? Number(req.query.current_page) : 1
        const number_of_rows = req.query.number_of_rows ? Number(req.query.number_of_rows) : await countWarehouse()
        const affiliations = await listWarehouse(current_page, number_of_rows)
        res.json(affiliations)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

export const show = async (req: Request, res: Response) => {
    try {
        const affiliation = await showWarehouse(Number(req.params.id))
        res.json(affiliation)
    } catch (e) {
        res.status(500).send(e)
    }
}

export const count = async (req: Request, res: Response) => {
    try {
        const count = await countWarehouse()
        res.json({ count })
    } catch (e) {
        res.status(500).send(e)
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const affiliation = await createWarehouse(req.body)
        res.status(201).json(affiliation)
    } catch (e) {
        res.status(500).send(e)
    }
}


export const update = async (req: Request, res: Response) => {
    try {
        const result = await updateWarehouse(Number(req.params.id), req.body)
        res.status(200).json(result)
    } catch (e) {
        res.status(500).send(e)
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const result = await removeWarehouse(Number(req.params.id))
        res.status(200).json(result)
    } catch (e) {
        res.status(500).send(e)
    }
}