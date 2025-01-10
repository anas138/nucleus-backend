import { promises } from 'dns';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
} from 'src/models/pagination.model';
import {
  DeleteResult,
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';

export interface IBaseRepository<T> {
  create(data: T | any, entityManager?: EntityManager): Promise<T>;

  findOneById(id: FindOptionsWhere<T>): Promise<T>;

  findByCondition(
    filterCondition: FindOptionsWhere<T>,
    order?: any,
    relations?: any,
  ): Promise<T>;

  findAll(options?: any): Promise<T[]>;

  findAllPaginated(
    paginationModel?: PaginationCalculatedModel | null,
    tableName?: string | null,
    joinCondition?: any | null,
  ): Promise<PaginatedResultsModel>;

  remove(data: T | any): Promise<T>;

  findWithRelations(relations: any): Promise<T[]>;

  update(data: T | any): Promise<T>;

  updateWithCondition(
    condition: FindOptionsWhere<T>,
    payload: any,
    entityManager?: EntityManager,
  ): Promise<any>;

  updateWithTransactionScope(
    date: T | any,
    entityManager: EntityManager,
  ): Promise<T>;

  deleteRecord(payload: {}, entityManager?: EntityManager): Promise<any>;

  count(payload: FindManyOptions): Promise<number>;
}
