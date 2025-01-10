import { Injectable } from '@nestjs/common';
import { IBaseRepository } from 'src/interfaces/base.repository.interface';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
} from 'src/models/pagination.model';
import {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export abstract class BaseAbstractRepository<T> implements IBaseRepository<T> {
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public createQueryBuilder(alias: string): any {
    return this.entity.createQueryBuilder(alias);
  }

  public async create(
    data: T | any,
    entityManager?: EntityManager,
  ): Promise<T> {
    if (entityManager) {
      return entityManager.getRepository(this.getEntityName()).save(data);
    }
    return this.entity.save(data);
  }

  public async update(payload: T): Promise<T> {
    return await this.entity.save(payload);
  }

  public async updateWithCondition(
    condition: FindOptionsWhere<T>,
    payload: any,
    entityManager?: EntityManager,
  ): Promise<any> {
    if (entityManager) {
      return entityManager
        .getRepository(this.getEntityName())
        .update(condition, payload);
    }
    return this.entity.update(condition, payload);
  }

  public async findOneById(id: FindOptionsWhere<T>): Promise<T> {
    return await this.entity.findOne({
      where: id,
    });
  }

  public async findByCondition(
    filterCondition: FindOptionsWhere<T>,
    order?: FindOptionsOrder<T>,
    relations?: any,
  ): Promise<T> {
    return await this.entity.findOne({
      where: filterCondition,
      order,
      relations,
    });
  }

  public async findAllByCondition(
    filterCondition: FindOptionsWhere<T>,
    order?: FindOptionsOrder<T>,
    relations?: any,
  ): Promise<T[]> {
    return await this.entity.find({
      where: filterCondition,
      order,
      relations,
    });
  }

  public async findWithRelations(relations: any): Promise<T[]> {
    return await this.entity.find(relations);
  }
  public getEntityColumnNames(): String[] {
    const {
      metadata: { columns },
    } = this.entity;
    const columnNames = columns.map((column) => column.databaseName);
    return columnNames;
  }
  public async findAll(options?: any): Promise<T[]> {
    return this.entity.find(options);
  }

  public async findAllPaginated(
    paginationModel: PaginationCalculatedModel,
    tableName: string,
    joinRelation: any,
  ): Promise<PaginatedResultsModel> {
    const { take, skip, search, orderBy, orderDirection, ...attributes } =
      paginationModel;
    const columnNames = this.getEntityColumnNames();
    const queryBuilder = this.entity.createQueryBuilder('troubleTicketTable');

    if (joinRelation?.length) {
      joinRelation.forEach(({ joinColumn, joinTable }) => {
        queryBuilder.leftJoinAndSelect(
          `troubleTicketTable.${joinColumn}`,
          `${joinTable}`,
        );
      });
    }

    if (search) {
      columnNames.forEach((columnName) => {
        queryBuilder.orWhere(`${columnName} LIKE :keyword`, {
          keyword: `%${search}%`,
        });
      });
    }
    const attributesLength = Object.keys(attributes).length;
    if (attributesLength) {
      for (let key of Object.keys(attributes)) {
        if (columnNames.includes(key) && attributes[key]) {
          queryBuilder.andWhere(`${key} LIKE :keyword`, {
            keyword: `%${attributes[key]}%`,
          });
        }
      }
    }

    if (orderBy && orderDirection && columnNames.includes(orderBy)) {
      queryBuilder.addOrderBy(`${orderBy}`, orderDirection);
    }
    const [entities, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const limit = take;
    const page = skip / take + 1;
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page + 1 > totalPages ? false : true;
    const hasPrevPage = page - 1 < 1 ? false : true;

    return {
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      list: entities,
      queryBuilder: queryBuilder,
    };
  }

  public async remove(payload: T): Promise<T> {
    return this.entity.save(payload);
  }

  private getEntityName(): string {
    return this.entity.metadata.name;
  }

  public async updateWithTransactionScope(
    payload: T,
    entityManager: EntityManager,
  ): Promise<T> {
    return entityManager.getRepository(this.getEntityName()).save(payload);
  }

  async deleteRecord(payload: {}, entityManager?: EntityManager): Promise<any> {
    if (entityManager) {
      return entityManager.getRepository(this.getEntityName()).delete(payload);
    }
    return this.entity.delete({ ...payload });
  }

  async count(payload: FindManyOptions<T>): Promise<number> {
    return this.entity.count(payload);
  }
}

// if (paginationModel) {
//   const { take, skip, searchBy, search, orderBy } = paginationModel;
//   const queryBuilder = this.entity.createQueryBuilder();

//   if (searchBy && searchBy.length && search) {
//     const searchColumns = searchBy.map((column) => `${column}`);
//     const searchConditions = searchColumns.map(
//       (column) => `${column} LIKE :search`,
//     );
//     queryBuilder.andWhere(`(${searchConditions.join(' OR ')})`, {
//       search: `%${search}%`,
//     });
//   }
//   if (orderBy && orderBy.length) {
//     orderBy.forEach((order) => {
//       const { column, order: direction } = order;
//       queryBuilder.addOrderBy(`${column}`, direction);
//     });
//   }

//   const [entities, total] = await queryBuilder
//     .skip(skip)
//     .take(take)
//     .getManyAndCount();
//   return entities;
// }
