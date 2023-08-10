import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Role } from "../models/role.model";
import { countRole, createRole, listRole, removeRole, showRole, updateRole } from "../context/role";

export const index = async (req: Request, res: Response) => {
    try {
        const current_page = req.query.current_page ? Number(req.query.current_page) : 1
        const number_of_rows = req.query.number_of_rows ? Number(req.query.number_of_rows) : await countRole()
        const roles = await listRole(current_page, number_of_rows)
        res.json(roles)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const show = async (req: Request, res: Response) => {
    try {
        const role = await showRole(Number(req.params.id))
        res.json(role)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const count = async (req: Request, res: Response) => {
    try {
        const count = await countRole()
        res.json({count})
    } catch(e) {
        res.status(500).send(e)
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const role = await createRole(req.body)
        res.status(201).json(role)
    } catch(e) {
        res.status(500).send(e)
    }
}


export const update = async (req: Request, res: Response) => {
    try {
        const result = await updateRole(Number(req.params.id), req.body)
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const result = await removeRole(Number(req.params.id))
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}