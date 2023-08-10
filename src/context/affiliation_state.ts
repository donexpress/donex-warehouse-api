import { AppDataSource } from "../config/ormconfig";
import { AffiliationState } from "../models/affiliationState.model";

export const listAffiliationState = async(current_page: number, number_of_rows: number) => {
    return AppDataSource.manager.find(AffiliationState, {
        take: number_of_rows,
        skip: (current_page - 1) * number_of_rows,
        order: {
            id: 'ASC'
        }
    })
}

export const countAffiliationState = async() => {
    return AppDataSource.manager.count(AffiliationState)
}

export const showAffiliationState = async(id: number) => {
    return await AppDataSource.manager.findOne(AffiliationState, {
        where: {
            id: Number(id)
        }
    })
}

export const createAffiliationState = async(affiliation_state_data) => {
    const repository = await AppDataSource.getRepository(AffiliationState);
    const affiliation = repository.create(affiliation_state_data)
    await AppDataSource.manager.save(affiliation)
    return affiliation
}

export const updateAffiliationState = async(id: number, affiliation_state_data) => {
    const repository = await AppDataSource.getRepository(AffiliationState);
    const result = await repository.update({id}, affiliation_state_data)
    return result;
}

export const removeAffiliationState = async(id: number) => {
    const repository = await AppDataSource.getRepository(AffiliationState);
    const result = await repository.delete({id})
    return result
}