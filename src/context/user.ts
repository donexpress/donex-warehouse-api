import { AppDataSource } from "../config/ormconfig";
import { User } from "../models/user.model";
import { Affiliation } from "../models/affiliation.model";
import bcrypt from 'bcryptjs';
import { In } from 'typeorm';

export const listUsers = async(current_page: number, number_of_rows: number) => {
    const users = await AppDataSource.manager.find(User, {
        take: number_of_rows,
        skip: (current_page - 1) * number_of_rows,
        order: {
            id: 'ASC'
        },
        relations: [ 'state', 'role', 'affiliations', 'affiliations.state']
    })
    users.map(user => delete user.password)
    return users
}

export const countUsers = async() => {
    return AppDataSource.manager.count(User)
}

export const showUser = async(id: number) => {
    const user = await AppDataSource.manager.findOne(User, {
        where: { id },
        relations: [ 'state', 'role', 'affiliations', 'affiliations.state']
    })
    delete user.password
    return user;
}

export const createUser = async(user_data) => {
    const repository = await AppDataSource.getRepository(User);
    const user_obj = user_data;
    const affiliation_repository = await AppDataSource.getRepository(Affiliation)
    const affiliation_ref = await affiliation_repository.find({
        where: {id: In(user_obj.affiliations)}
    })
    user_obj.affiliations = affiliation_ref
    user_obj.password = bcrypt.hashSync(user_obj.password, isNaN(Number(process.env.PASSWORD_SALT)) ? 10 : Number(process.env.PASSWORD_SALT))
    const user = await repository.create(user_obj);
    await AppDataSource.manager.save(user);
    // @ts-ignore
    delete user.password
    return user
}

export const updateUser = async(id: number, user_data) => {
    const repository = await AppDataSource.getRepository(User);
    const result = await repository.update({id}, user_data)
    return result;
}

export const removeUser = async(id: number) => {
    const repository = await AppDataSource.getRepository(User);
    const result = await repository.delete({id})
    return result
}