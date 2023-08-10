import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { UserState } from "../models/userState.model";
import { countUserState, createUserState, listUserState, removeUserState, showUserState, updateUserState } from "../context/user_state";

export const index = async (req: Request, res: Response) => {
    try {
        const current_page = req.query.current_page ? Number(req.query.current_page) : 1
        const number_of_rows = req.query.number_of_rows ? Number(req.query.number_of_rows) : await countUserState()
        const states = await listUserState(current_page, number_of_rows)
        res.json(states)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const show = async (req: Request, res: Response) => {
    try {
        const state = await showUserState(Number(req.params.id))
        res.json(state)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const count = async (req: Request, res: Response) => {
    try {
        const count = await countUserState()
        res.json({count})
    } catch(e) {
        res.status(500).send(e)
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const state = await createUserState(req.body)
        res.status(201).json(state)
    } catch(e) {
        res.status(500).send(e)
    }
}


export const update = async (req: Request, res: Response) => {
    try {
        const result = await updateUserState(Number(req.params.id), req.body)
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const result = await removeUserState(Number(req.params.id))
        res.status(200).json(result)
    } catch(e) {
        res.status(500).send(e)
    }
}