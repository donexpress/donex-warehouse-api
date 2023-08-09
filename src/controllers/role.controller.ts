import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Role } from "../entity/Role.entity";

export const index = async (req: Request, res: Response) => {
    try {
        const current_page = req.query.current_page ? Number(req.query.current_page) : 1
        const number_of_rows = req.query.number_of_rows ? Number(req.query.number_of_rows) : 10
        const roles = await AppDataSource.manager.find(Role, {
            take: number_of_rows,
            skip: (current_page - 1) * number_of_rows,
            order: {
                id: 'ASC'
            }
        })
        res.json(roles)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const show = async (req: Request, res: Response) => {
    try {
        const role = await AppDataSource.manager.findOne(Role, {
            where: {
                id: Number(req.params.id)
            }
        })
        res.json(role)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const count = async (req: Request, res: Response) => {
    try {
        const count = await AppDataSource.manager.count(Role)
        res.json({count})
    } catch(e) {
        res.status(500).send(e)
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const repository = await AppDataSource.getRepository(Role);
        const role = repository.create(req.body)
        await AppDataSource.manager.save(role)
        res.status(201).json(role)
    } catch(e) {
        res.status(500).send(e)
    }
}


export const update = async (req: Request, res: Response) => {
    try {
        const repository = await AppDataSource.getRepository(Role);
        const result = await repository.update({id: Number(req.params.id)}, req.body)
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const repository = await AppDataSource.getRepository(Role);
        const result = await repository.delete({id: Number(req.params.id)})
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}