import { AppDataSource } from "../config/ormconfig";
import { Affiliation } from "../models/affiliation.model";

export const listAffiliation = async(current_page: number, number_of_rows: number) => {
    return AppDataSource.manager.find(Affiliation, {
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
}

export const countAffiliation = async() => {
    return AppDataSource.manager.count(Affiliation)
}

export const showAffiliation = async(id: number) => {
    return await AppDataSource.manager.findOne(Affiliation, {
        where: { id },
        relations: {
            // @ts-ignore
            state: true
        }
    })
}

export const createAffiliation = async(affiliation_data) => {
    const repository = await AppDataSource.getRepository(Affiliation);
    const affiliation = repository.create(affiliation_data)
    await AppDataSource.manager.save(affiliation)
    return affiliation
}

export const updateAffiliation = async(id: number, affiliation_data) => {
    const repository = await AppDataSource.getRepository(Affiliation);
    const result = await repository.update({id}, affiliation_data)
    return result;
}

export const removeAffiliation = async(id: number) => {
    const repository = await AppDataSource.getRepository(Affiliation);
    const result = await repository.delete({id})
    return result
}