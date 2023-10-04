import { ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Organization } from '../models/organization.model';
import { showUser } from './user';
import { showLineClassification } from './line_classification';

export const listDepataments = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  const organizations = await AppDataSource.manager.find(Organization, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [{ name: ILike(`%${query}%`) }],
    order: {
      id: 'DESC',
    },
  });
  const mod_organizations = [];
  for (let i = 0; i < organizations.length; i++) {
    const organization = organizations[i];
    const heads_of_department = [];
    const principals_lines = [];
    for (let j = 0; j < organization.head_of_department.length; j++) {
      const head = organization.head_of_department[j];
      const user = await showUser(head);
      if (user) {
        heads_of_department.push(user);
      }
    }
    for (let j = 0; j < organization.principal_line.length; j++) {
      const principal = organization.principal_line[j];
      const principal_line = await showLineClassification(principal);
      if (principal_line) {
        principals_lines.push(principal_line);
      }
    }
    mod_organizations.push({
      ...organization,
      heads_of_department,
      principals_lines,
    });
  }
  return mod_organizations;
};

export const countDepataments = async () => {
  return AppDataSource.manager.count(Organization);
};

export const showDepataments = async (id: number) => {
  const organization = await AppDataSource.manager.findOne(Organization, {
    where: { id },
  });
  const heads_of_department = [];
  for (let j = 0; j < organization.head_of_department.length; j++) {
    const head = organization.head_of_department[j];
    const user = await showUser(head);
    if (user) {
      heads_of_department.push(user);
    }
  }
  const principals_lines = [];
  for (let j = 0; j < organization.principal_line.length; j++) {
    const principal = organization.principal_line[j];
    const principal_line = await showLineClassification(principal);
    if (principal_line) {
      principals_lines.push(principal_line);
    }
  }
  return { ...organization, heads_of_department, principals_lines };
};

export const createDepataments = async (organization_data) => {
  const repository = await AppDataSource.getRepository(Organization);
  const organization = repository.create(organization_data);
  return await validateContext(AppDataSource, organization);
};

export const updateDepataments = async (id: number, organization_data) => {
  const repository = await AppDataSource.getRepository(Organization);
  const result = await repository.update({ id }, organization_data);
  return result;
};

export const removeDepataments = async (id: number) => {
  const repository = await AppDataSource.getRepository(Organization);
  const result = await repository.delete({ id });
  return result;
};
