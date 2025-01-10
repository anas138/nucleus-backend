import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  APP_CONSTANTS,
  APP_MESSAGES,
  APP_PERMISSIONS,
  RecordStatus,
  UserType,
  seconds,
} from 'src/common/enums/enums';
import * as bcrypt from 'bcrypt';
import {
  CreateUserModel,
  FetchUserModel,
  SimpleFetchUser,
  UpdateUserModel,
  UserCreatedModel,
  simpleFetchUserTransformer,
} from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { Region } from 'src/entities/region.entity';
import { Segment } from 'src/entities/segment.entity';
import { User } from 'src/entities/user.entity';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
  PaginationQueryModel,
} from 'src/models/pagination.model';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { UserPermissionService } from './user-permission.service';
import { UserRoleService } from './user-role.service';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Not,
  QueryRunner,
  DataSource,
} from 'typeorm';
import { EmailTemplatesService } from '../shared/email-templates.service';
import { SendMailModel } from 'src/models/send-mail.model';
import { EmailQueueService } from 'src/microservices/queues/email-queue/email-queue.service';
import { RegionService } from '../region/region.service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { FetchSubDepartmentModel } from 'src/models/sub-department.model';
import { BaseService } from 'src/common/services/base.service';
import { USerSubDepartmentMappingService } from '../user_subdepartment_mapping/user_subdepartment_mapping.service';
import { RedisCacheService } from 'src/common/redis/redis-cache.service';

// import { SubDepartmentService } from '../sub-department/sub-department.service';
// import { DepartmentService } from '../department/department.service';
// import { DesignationService } from '../designation/designation.service';

@Injectable()
export class UserService extends BaseService<User> {
  static relations = [
    'department',
    'roles',
    'roles.permissions',
    'permissions',
    'sub_department',
    'designation',
    'regions',
    'segments',
    'userDepartments',
  ];
  constructor(
    private userRepository: UserRepository,
    private helperFunctions: HelperFunctions,
    private userPermissionService: UserPermissionService,
    private userRoleService: UserRoleService, // private subDepartmentService: SubDepartmentService, // private departmentService: DepartmentService, // private designationService: DesignationService,
    private emailTemplateService: EmailTemplatesService,
    private emailQueueService: EmailQueueService,
    private redisCacheService: RedisCacheService,
    private regionService: RegionService,
    private readonly env: EnvironmentConfigService,
    private readonly userSubDepartmentMappingService: USerSubDepartmentMappingService,
    private readonly dataSource: DataSource,
  ) {
    super(userRepository);
  }

  async getAll(
    paginationQuery: PaginationQueryModel,
  ): Promise<PaginatedResultsModel> {
    const calculatedPagination: PaginationCalculatedModel =
      this.helperFunctions.calculatePagination(paginationQuery);
    const paginatedUsers = await this.userRepository.getAll(
      calculatedPagination,
    );
    const transformedUsers = paginatedUsers.list.map((user: User) => {
      delete user['password'];
      return this.transformUser(user);
    });
    return { ...paginatedUsers, list: transformedUsers };
  }

  async getUserById(userId: number): Promise<FetchUserModel> {
    const options: FindOneOptions<User> = {
      where: {
        id: userId,
      },
      relations: UserService.relations,
    };

    const user: User = await this.userRepository.findOne(options);
    if (!user) {
      throw new NotFoundException(APP_MESSAGES.User.ERROR_USER_NOT_FOUND);
    }
    const transformedUser: any = this.transformUser(user);
    const rolePermissions: Array<any> =
      await this.userPermissionService.getPermissionsAttachedWithRoles(user);
    if (transformedUser?.permissions) {
      transformedUser.permissions = [
        ...new Set(
          [...transformedUser?.permissions, ...rolePermissions].map(
            (permission) => {
              return JSON.stringify(permission);
            },
          ),
        ),
      ].map((permission) => {
        return JSON.parse(permission);
      });
      transformedUser.role_permissions = rolePermissions;
    }
    return transformedUser;
  }
  async findByUsername(username: string): Promise<FetchUserModel | undefined> {
    const options: FindOneOptions<User> = {
      where: {
        username,
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
    };
    const user = await this.userRepository.findOne(options);
    if (!user) {
      throw new NotFoundException(APP_MESSAGES.User.ERROR_USER_NOT_FOUND);
    }
    const transformedUser = this.transformUser(user);
    return transformedUser;
  }

  transformUser(user: any) {
    const {
      roles,
      permissions,
      department,
      designation,
      sub_department,
      regions,
      segments,
      ...userWithoutRelations
    } = user;
    const userDetails: FetchUserModel = {
      ...userWithoutRelations,
      profile_picture: user.profile_picture
        ? `${this.env.getFileServerUrl()}/${user.profile_picture}`
        : null,
      roles: roles.map((role: Role) => {
        return { id: role.id, name: role.name };
      }),
      permissions: this.setPermission(permissions, user?.roles[0]?.permissions),
      designation: designation?.name,
      designation_id: designation?.id,
      department: department?.name,
      department_id: department?.id,
      sub_department: sub_department?.name,
      regions: regions.map((region: Region) => {
        return { id: region.id, name: region.name };
      }),
      segments: segments.map((segment: Segment) => segment.name),
    };
    return userDetails;
  }

  setPermission(userPermissions: Permission[], rolePermission: Permission[]) {
    let permissions = [];

    if (rolePermission?.length) {
      const userTempPermission = rolePermission.map((p) => {
        return { id: p.id, name: p.name };
      });
      permissions = [...permissions, ...userTempPermission];
    }

    if (userPermissions?.length) {
      const roleTempPermission = userPermissions.map((p) => {
        return { id: p.id, name: p.name };
      });
      permissions = [...permissions, ...roleTempPermission];
    }

    return permissions;
  }

  async createUser(
    createUserModel: CreateUserModel,
  ): Promise<UserCreatedModel> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const { role_ids, region_ids } = createUserModel;
      const password = this.helperFunctions.generateRandomString(
        APP_CONSTANTS.PASSWORD_LENGTH,
      );
      // const isValid = await this.checkIfValidRelations(createUserModel);
      let roles: Role[], regions: Region[];
      if (role_ids?.length) {
        roles = await this.userRoleService.getRolesOfRoleIds(role_ids);
      }
      if (region_ids?.length) {
        const where: FindOptionsWhere<Region> = {
          id: In(region_ids),
        };
        regions = await this.regionService.findAll({
          where,
        });
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserModel.password, salt);

      const whereUser: FindOptionsWhere<User> = {
        username: createUserModel.username,
      };

      const checkUser = await this.getByCondition(whereUser);
      if (checkUser) {
        throw new ConflictException(APP_MESSAGES.User.ERROR_DUPLICATE_USERNAME);
      }

      const whereEmail: FindOptionsWhere<User> = {
        email: createUserModel.email,
      };

      const checkEmail = await this.getByCondition(whereEmail);
      if (checkEmail) {
        throw new ConflictException(
          APP_MESSAGES.User.ERROR_USER_DUPLICATE_EMAIL,
        );
      }
      const userModelWithHashPass: CreateUserModel = {
        ...createUserModel,
        ms_org_email: this.helperFunctions.normalizeEmailForMSAL(
          createUserModel.email,
        ),
        password: hashedPassword,
        roles,
        regions,
      };

      const user: UserCreatedModel = await this.userRepository.createUser(
        userModelWithHashPass,
        queryRunner,
      );
      const { password: pass, ...userWithoutPassword } = user;

      // insert record if multiple sub department exists

      await this.userSubDepartmentMappingService.createOrUpdate(
        createUserModel.sub_department_ids,
        user.id,
        user.department_id,
        user.created_by,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return userWithoutPassword;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async updateUser(
    userId: number,
    user: UpdateUserModel,
    runner?: QueryRunner,
  ): Promise<FetchUserModel | any> {
    let queryRunner: any;
    queryRunner = runner;
    if (!runner) {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.startTransaction();
    }
    try {
      const { role_ids, region_ids, email } = user;
      if (role_ids?.length) {
        user.roles = await this.userRoleService.getRolesOfRoleIds(role_ids);
      }
      if (region_ids?.length) {
        const where: FindOptionsWhere<Region> = {
          id: In(region_ids),
        };
        user.regions = await this.regionService.findAll({
          where,
        });
      }

      // check duplicate email
      if (email) {
        const isEmail = await this.findByCondition({
          email: email,
          id: Not(userId),
        });
        if (isEmail) {
          throw new BadRequestException('Email already exists.');
        }
        const ms_org_email = this.helperFunctions.normalizeEmailForMSAL(email);
        user = { ...user, ms_org_email };
      }

      if (user.hasOwnProperty('password')) {
        const salt = await bcrypt.genSalt();
        user['password'] = await bcrypt.hash(user['password'], salt);
      }
      if (queryRunner) {
        await this.userRepository.updateUser(userId, user, queryRunner);
      }
      //await this.userRepository.updateUser(userId, user);

      await this.userSubDepartmentMappingService.createOrUpdate(
        user.sub_department_ids,
        userId,
        user.department_id,
        user.updated_by,
        queryRunner,
      );
      if (!runner) await queryRunner.commitTransaction();
      return {};
    } catch (error) {
      if (!runner) {
        await queryRunner.rollbackTransaction();
        throw error;
      }
    } finally {
      if (!runner) await queryRunner.release();
    }
  }

  async findByDepartmentId(departmentId: number): Promise<User> {
    const options: FindOneOptions<User> = {
      where: {
        department_id: departmentId,
        record_status: RecordStatus.ACTIVE,
      },
      relations: ['department'],
    };
    return this.userRepository.findOne(options);
  }

  async getAllUsersOfSubDepartment(subDepartmentId: number) {
    const options: FindManyOptions<User> = {
      where: {
        sub_department_id: subDepartmentId,
        record_status: RecordStatus.ACTIVE,
      },
      relations: ['sub_department'],
    };
    return this.userRepository.findAll(options);
  }

  async updateUserRecordStatus(
    userId: number,
    recordStatus: RecordStatus,
  ): Promise<void> {
    const options: FindOneOptions<User> = {
      where: {
        id: userId,
      },
    };
    const user = await this.userRepository.findOne(options);
    if (!user) {
      throw new NotFoundException(APP_MESSAGES.User.ERROR_USER_NOT_FOUND);
    }
    user.record_status = recordStatus;
    await this.userRepository.updateUser(userId, user);
    return;
  }

  async getAllUsersOfSubDepartmentHavingRegion(
    subDepartmentId: number,
    regionId: number,
  ) {
    const options: FindManyOptions<User> = {
      where: {
        sub_department_id: subDepartmentId,
        regions: {
          id: regionId,
        },
        record_status: RecordStatus.ACTIVE,
      },
      relations: ['regions'],
    };
    return this.userRepository.findAll(options);
  }

  async getAllUsersByUserType(userType: UserType): Promise<SimpleFetchUser[]> {
    const options: FindManyOptions<User> = {
      where: {
        user_type: userType,
        record_status: RecordStatus.ACTIVE,
      },
    };
    const users: User[] = await this.userRepository.findAll(options);
    const transformedUsers = users.map((user: User) =>
      simpleFetchUserTransformer(user),
    );
    return transformedUsers;
  }

  async getByCondition(where: FindOptionsWhere<User>) {
    const options: FindOneOptions<User> = {
      where,
    };
    return this.userRepository.findOne(options);
  }

  async getAllByCondition(where: FindOptionsWhere<User>) {
    const options: FindOneOptions<User> = {
      where,
      relations: ['roles', 'roles.permissions', 'permissions', 'regions'],
    };

    return this.userRepository.findAll(options);
  }

  async sendSetupPasswordMail(user: UserCreatedModel) {
    const { email, username, full_name: name } = user;
    const token = this.helperFunctions.generateUUID();
    await this.saveTokenToCache(token, user.id);
    const html = this.emailTemplateService.getSetupPasswordTemplate({
      email,
      username,
      name,
      token,
    });
    const sendMailModel: SendMailModel = {
      to: email,
      subject: APP_CONSTANTS.EMAIL_SUBJECTS.SETUP_PASSWORD,
      html,
    };
    if (
      this.env.getIfEmailNotificationToBeSentOnUserCreation() &&
      this.env.getIfEmailNotificationToBeSent()
    ) {
      return this.emailQueueService.addJobInQueue({ ...sendMailModel });
    } else {
      return {
        email,
        token,
        username,
        name,
      };
    }
  }

  async saveTokenToCache(key: string, value: number) {
    const ttl: seconds = APP_CONSTANTS.SETUP_PASSWORD_TOKEN_TTL;
    await this.redisCacheService.set(key, value, ttl);
  }

  async findGroupUserBySubDepartment(
    subDepartment: FetchSubDepartmentModel,
    regionId?: number[],
  ) {
    const condition: any = {
      sub_department_id: subDepartment.id,
      user_type: UserType.GROUP,
      record_status: RecordStatus.ACTIVE,
    };

    if (regionId) {
      condition.regions = {
        id: In([regionId]),
      };
    }

    const groupUser = await this.userRepository.findOne({
      where: {
        ...condition,
      },
      relations: ['regions'],
    });

    if (!groupUser) {
      throw new Error(
        APP_MESSAGES.User.GROUP_USER_DOES_NOT_EXISTS(subDepartment.name),
      );
    }

    return groupUser;
  }

  async getGroupUserBySubDepartment(id: number) {
    const groupUser = await this.getByCondition({
      sub_department_id: id,
      user_type: UserType.GROUP,
    });

    if (!groupUser) {
      throw new BadRequestException(
        APP_MESSAGES.User.GROUP_USER_DOES_NOT_EXISTS,
      );
    }
    return groupUser;
  }

  async getUserEmailsBySubDepartmentOnPriorityBase(
    subDepartmentId: number,
    permission: string,
  ) {
    const users = await this.findAll({
      where: [
        {
          sub_department_id: subDepartmentId,
          permissions: {
            name: permission,
          },
        },
        {
          sub_department_id: subDepartmentId,
          roles: {
            permissions: {
              name: permission,
            },
          },
        },
      ],
      relations: UserService.relations,
    });

    const emails = users.map((user) => user.email);
    const mappingDepartmentEmails =
      await this.userSubDepartmentMappingService.getUserEmailsBySubDeptAndPermission(
        subDepartmentId,
        permission,
      );
    const mergedEmails = [...emails, ...mappingDepartmentEmails];

    if (mergedEmails.length) {
      return mergedEmails;
    }
    return null;
  }
}
