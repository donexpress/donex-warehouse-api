import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Affiliation } from "../entity/Affiliation.entity";

export const index = async (req: Request, res: Response) => {
    try {
        const current_page = req.query.current_page ? Number(req.query.current_page) : 1
        const number_of_rows = req.query.number_of_rows ? Number(req.query.number_of_rows) : 10
        const affiliations = await AppDataSource.manager.find(Affiliation, {
            take: number_of_rows,
            skip: (current_page - 1) * number_of_rows,
            order: {
                id: 'ASC'
            },
            relations: {
                // @ts-ignore
                state: true
            }
        })
        res.json(affiliations)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const show = async (req: Request, res: Response) => {
    try {
        const affiliation = await AppDataSource.manager.findOne(Affiliation, {
            where: {
                id: Number(req.params.id)
            },
            relations: {
                // @ts-ignore
                state: true
            }
        })
        res.json(affiliation)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const count = async (req: Request, res: Response) => {
    try {
        const count = await AppDataSource.manager.count(Affiliation)
        res.json({count})
    } catch(e) {
        res.status(500).send(e)
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const repository = await AppDataSource.getRepository(Affiliation);
        const affiliation = repository.create(req.body)
        await AppDataSource.manager.save(affiliation)
        res.status(201).json(affiliation)
    } catch(e) {
        res.status(500).send(e)
    }
}


export const update = async (req: Request, res: Response) => {
    try {
        const repository = await AppDataSource.getRepository(Affiliation);
        const result = await repository.update({id: Number(req.params.id)}, req.body)
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const repository = await AppDataSource.getRepository(Affiliation);
        const result = await repository.delete({id: Number(req.params.id)})
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}