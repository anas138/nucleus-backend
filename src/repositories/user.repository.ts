import { User } from 'src/entities/user.entity';
import {
  Brackets,
  FindManyOptions,
  FindOneOptions,
  FindOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
} from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'src/interfaces/user.repository.interface';
import {
  CreateUserModel,
  FetchUserModel,
  UpdateUserModel,
  UpdatedUserModel,
  UserCreatedModel,
} from 'src/models/user.model';
import { FetchPermissionModel } from 'src/models/permission.model';
import { FetchRoleModel } from 'src/models/role.model';
import { APP_MESSAGES, RecordStatus } from 'src/common/enums/enums';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
} from 'src/models/pagination.model';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { BaseAbstractRepository } from './base/base.repository';

@Injectable()
export class UserRepository extends BaseAbstractRepository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private helperFunctions: HelperFunctions,
  ) {
    super(userRepository);
  }
  async findByUsername(username: string): Promise<any | undefined> {
    return this.userRepository.findOne({
      where: {
        username,
        record_status: RecordStatus.ACTIVE,
      },
      relations: [
        'department',
        'roles',
        'roles.permissions',
        'permissions',
        'sub_department',
        'designation',
        'regions',
        'segments',
      ],
    });
  }

  async findById(id: number): Promise<any> {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: [
        'department',
        'roles',
        'roles.permissions',
        'permissions',
        'sub_department',
        'designation',
        'regions',
        'segments',
      ],
    });
  }

  async findByDepartmentId(departmentId: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.department', 'department')
      .where('department.id = :departmentId', { departmentId })
      .getOne();
    return user;
  }

  getUserColumnNames(): String[] {
    const {
      metadata: { columns },
    } = this.userRepository;
    const userColumnNames = columns.map((column) => column.databaseName);
    return userColumnNames;
  }

  async getAll(
    calculatedPagination: PaginationCalculatedModel,
  ): Promise<PaginatedResultsModel> {
    const { take, skip, search, orderBy, orderDirection, ...attributes } =
      calculatedPagination;
    const userColumnNames = this.getUserColumnNames();

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.department', 'department')
      .leftJoinAndSelect('user.sub_department', 'sub_department')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .leftJoinAndSelect('user.designation', 'designation')
      .leftJoinAndSelect('user.regions', 'regions')
      .leftJoinAndSelect('user.segments', 'segments')
      .leftJoinAndSelect('user.userDepartments', 'userDepartments')
      .leftJoinAndSelect('userDepartments.subDepartment', 'subDepartment');

    if (search) {
      queryBuilder.andWhere(
        new Brackets((searchBrackets) => {
          const searchConditions: string[] = userColumnNames.map(
            (columnName) => {
              return `user.${columnName} LIKE :search`;
            },
          );
          const updatedSearchCondtion = [
            ...searchConditions,
            'department.name LIKE:search',
            'sub_department.name LIKE:search',
          ];
          // Add the search condition if at least one userColumn matches
          if (updatedSearchCondtion.length > 0) {
            searchBrackets.where(updatedSearchCondtion.join(' OR '), {
              search: `%${search}%`,
            });
          }
        }),
      );
    }

    const attributesLength = Object.keys(attributes).length;
    if (attributesLength) {
      queryBuilder.andWhere(
        new Brackets((attrBrackets) => {
          const attributeConditions: string[] = [];
          for (let key of Object.keys(attributes)) {
            if (userColumnNames.includes(key) && attributes[key]) {
              attributeConditions.push(`user.${key} LIKE :${key}`);
            }
          }
          // Add the attribute conditions if any attribute matches
          if (attributeConditions.length > 0) {
            attrBrackets.where(attributeConditions.join(' AND '), attributes);
          }
        }),
      );
    }

    if (orderBy && orderDirection && userColumnNames.includes(orderBy)) {
      queryBuilder.addOrderBy(`user.${orderBy}`, orderDirection);
    }

    const [entities, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    //meta-pagination-information
    const basicPaginationProps =
      this.helperFunctions.calculatPaginationProperties(total, take, skip);

    return {
      ...basicPaginationProps,
      list: entities,
    };
  }

  async createUser(
    createUserModel: CreateUserModel,
    queryRunner?: QueryRunner,
  ): Promise<UserCreatedModel> {
    const user: User = queryRunner.manager.create(User, createUserModel);
    try {
      await queryRunner.manager.save(user);
    } catch (err) {
      throw new ConflictException(APP_MESSAGES.User.ERROR_DUPLICATE_USERNAME);
    }
    delete user.roles;
    delete user.permissions;
    return user as UserCreatedModel;
  }

  async getUserPermissions(userId: number): Promise<FetchPermissionModel[]> {
    const userData = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['permissions'],
    });
    const { permissions } = userData;
    return permissions;
  }

  async getUserRoles(userId: number): Promise<FetchRoleModel[]> {
    const userData = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles'],
    });
    const { roles } = userData;
    return roles;
  }

  async updateUser(
    userId: number,
    userModel: UpdateUserModel,
    queryRunner?: QueryRunner,
  ): Promise<UpdatedUserModel> {
    let user: UpdatedUserModel = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (user) {
      user = { ...user, ...userModel };

      if (queryRunner) {
        return queryRunner.manager.save(User, user);
      }
      return await this.userRepository.save(user);
    }
  }

  async updateUserPermissions(
    user: User,
    permissions: Permission[],
  ): Promise<User> {
    user.permissions = [...permissions];
    try {
      const result = this.userRepository.save(user);
      return result;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async updateUserRoles(user: User, roles: Role[]): Promise<User> {
    user.roles = [...roles];
    try {
      const result = this.userRepository.save(user);
      return result;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async remove(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findUsersOfSubDepartmentHavingRegion(
    subDepartmentId: number,
    regionId: number,
  ) {
    return this.userRepository.find({
      where: {
        sub_department_id: subDepartmentId,
        regions: {
          id: regionId,
        },
      },
      relations: ['regions'],
    });
  }

  async findAllWithCondition(where: FindOptionsWhere<User>) {
    return this.userRepository.find({ where });
  }

  async findOneByCondition(where: FindOptionsWhere<User>) {
    return this.userRepository.findOne({
      where: {
        ...where,
        record_status: RecordStatus.ACTIVE,
      },
    });
  }

  async findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }
  async findAll(options: FindManyOptions<User>) {
    return this.userRepository.find(options);
  }
}
