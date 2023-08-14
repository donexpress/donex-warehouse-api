import { Request, Response } from "express";
import { countUser, createUser, listUser, removeUser, showUser, updateUser } from "../context/user";

export const index = async (req: Request, res: Response) => {
    try {
        const current_page = req.query.current_page ? Number(req.query.current_page) : 1
        const number_of_rows = req.query.number_of_rows ? Number(req.query.number_of_rows) : await countUser()
        const users = await listUser(current_page, number_of_rows)
        res.json(users)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

export const show = async (req: Request, res: Response) => {
    try {
        const user = await showUser(Number(req.params.id))
        res.json(user)
    } catch (e) {
        res.status(500).send(e)
    }
}

export const count = async (req: Request, res: Response) => {
    try {
        const count = await countUser()
        res.json({ count })
    } catch (e) {
        res.status(500).send(e)
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const user = await createUser(req.body)
        res.status(201).json(user);
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
}


export const update = async (req: Request, res: Response) => {
    try {
        const result = await updateUser(Number(req.params.id), req.body)
        res.status(200).json(result)
    } catch (e) {
        res.status(500).send(e)
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const result = await removeUser(Number(req.params.id))
        res.status(200).json(result)
    } catch (e) {
        res.status(500).send(e)
    }
}