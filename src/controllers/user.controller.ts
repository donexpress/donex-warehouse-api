import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../entity/User.entity";

export const index = async (req: Request, res: Response) => {
    try {
        const current_page = req.query.current_page ? Number(req.query.current_page) : 1
        const number_of_rows = req.query.number_of_rows ? Number(req.query.number_of_rows) : 10
        const users = await AppDataSource.manager.find(User, {
            take: number_of_rows,
            skip: (current_page - 1) * number_of_rows,
            order: {
                id: 'ASC'
            }
        })
        res.json(users)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const show = async (req: Request, res: Response) => {
    try {
        const user = await AppDataSource.manager.findOne(User, {
            where: {
                id: Number(req.params.id)
            }
        })
        res.json(user)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const count = async (req: Request, res: Response) => {
    try {
        const count = await AppDataSource.manager.count(User)
        res.json({count})
    } catch(e) {
        res.status(500).send(e)
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const repository = await AppDataSource.getRepository(User);
        const user = repository.create(req.body)
        await AppDataSource.manager.save(user)
        res.status(201).json(user)
    } catch(e) {
        res.status(500).send(e)
    }
}


export const update = async (req: Request, res: Response) => {
    try {
        const repository = await AppDataSource.getRepository(User);
        const result = await repository.update({id: Number(req.params.id)}, req.body)
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const repository = await AppDataSource.getRepository(User);
        const result = await repository.delete({id: Number(req.params.id)})
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}