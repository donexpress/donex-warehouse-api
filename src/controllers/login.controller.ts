import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../entity/User.entity";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken'

export const login = async (req: Request, res: Response) => {
    const repository = await AppDataSource.getRepository(User)
    const user = await repository.findOne({where: {username: req.body.username}})
    if(!user || !bcrypt.compareSync(req.body.password, user.password)) {
        res.status(401).json({
            message: "User or password incorrect"
        })
    } else{
        const token = JWT.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            data: user
        },process.env.SECRET);
        res.send({token})
    }
}