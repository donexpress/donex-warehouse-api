import { Request, Response } from "express";
import { countWarehouseState, createWarehouseState, listWarehouseState, removeWarehouseState, showWarehouseState, updateWarehouseState } from "../context/warehouse_state";

export const index = async (req: Request, res: Response) => {
    try {
        const current_page = req.query.current_page ? Number(req.query.current_page) : 1
        const number_of_rows = req.query.number_of_rows ? Number(req.query.number_of_rows) : await countWarehouseState()
        const states = await listWarehouseState(current_page, number_of_rows)
        res.json(states)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

export const show = async (req: Request, res: Response) => {
    try {
        const state = await showWarehouseState(Number(req.params.id))
        res.json(state)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

export const count = async (req: Request, res: Response) => {
    try {
        const count = await countWarehouseState()
        res.json({ count })
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const state = await createWarehouseState(req.body)
        res.status(201).json(state)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}


export const update = async (req: Request, res: Response) => {
    try {
        const result = await updateWarehouseState(Number(req.params.id), req.body)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const result = await removeWarehouseState(Number(req.params.id))
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}