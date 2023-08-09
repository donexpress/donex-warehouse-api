import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { AffiliationState } from "../entity/AffiliationState.entity";

export const index = async (req: Request, res: Response) => {
    try {
        const current_page = req.query.current_page ? Number(req.query.current_page) : 1
        const number_of_rows = req.query.number_of_rows ? Number(req.query.number_of_rows) : 10
        const states = await AppDataSource.manager.find(AffiliationState, {
            take: number_of_rows,
            skip: (current_page - 1) * number_of_rows,
            order: {
                id: 'ASC'
            }
        })
        res.json(states)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const show = async (req: Request, res: Response) => {
    try {
        const state = await AppDataSource.manager.findOne(AffiliationState, {
            where: {
                id: Number(req.params.id)
            }
        })
        res.json(state)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const count = async (req: Request, res: Response) => {
    try {
        const count = await AppDataSource.manager.count(AffiliationState)
        res.json({count})
    } catch(e) {
        res.status(500).send(e)
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const state = new AffiliationState()
        state.name = req.body.name
        await AppDataSource.manager.save(state)
        res.status(201).json(state)
    } catch(e) {
        res.status(500).send(e)
    }
}


export const update = async (req: Request, res: Response) => {
    try {
        const repository = await AppDataSource.getRepository(AffiliationState);
        const result = await repository.update({id: Number(req.params.id)}, req.body)
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const repository = await AppDataSource.getRepository(AffiliationState);
        const result = await repository.delete({id: Number(req.params.id)})
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}