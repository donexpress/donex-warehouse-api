import { AppDataSource } from "../config/ormconfig";
import { Role } from "../models/role.model";

export const listRole = async(current_page: number, number_of_rows: number) => {
    return AppDataSource.manager.find(Role, {
        take: number_of_rows,
        skip: (current_page - 1) * number_of_rows,
        order: {
            id: 'ASC'
        }
    })
}

export const countRole = async() => {
    return AppDataSource.manager.count(Role)
}

export const showRole = async(id: number) => {
    return await AppDataSource.manager.findOne(Role, {
        where: { id }
    })
}

export const createRole = async(role_data) => {
    const repository = await AppDataSource.getRepository(Role);
    const role = repository.create(role_data)
    await AppDataSource.manager.save(role)
    return role
}

export const updateRole = async(id: number, role_data) => {
    const repository = await AppDataSource.getRepository(Role);
    const result = await repository.update({id}, role_data)
    return result;
}

export const removeRole = async(id: number) => {
    const repository = await AppDataSource.getRepository(Role);
    const result = await repository.delete({id})
    return result
}