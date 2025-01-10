import { Injectable, NotFoundException } from '@nestjs/common';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { DepartmentRoleModel, UpdateDepartmentRoleModel } from 'src/models/department-role.model';
import { DepartmentRepository } from 'src/repositories/department.repository';
import { FetchRoleModel } from 'src/models/role.model';
import { FetchDepartmentRoleModel } from 'src/models/department.model';
import { Department } from 'src/entities/department.entity';
import { RoleService } from '../role/role.service';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class DepartmentRoleService {
    constructor(
        private departmentRepository: DepartmentRepository,
        private roleService: RoleService,
    ) { }

    async getDepartmentRoles(departmentId: number): Promise<FetchDepartmentRoleModel> {
        const roles: FetchRoleModel[] =
            await this.departmentRepository.getDepartmentRoles(departmentId);
        return {
            roles: roles.map((role) => role.name),
        };
    }

    areBothEqualInSize(
        matchedRoles: Role[],
        inputRoleIds: number[],
    ) {
        if (matchedRoles.length != inputRoleIds.length) {
            throw new NotFoundException(
                APP_MESSAGES.Permission.ERROR_SOME_PERMISSIONS_NOT_FOUND,
            );
        }
        return true;
    }
    async updateDepartmentRoles(
        departmentId: number,
        updateDepartmentRoleModel: UpdateDepartmentRoleModel,
    ): Promise<DepartmentRoleModel> {
        const { roleIds } = updateDepartmentRoleModel;
        const department = await this.departmentRepository.findOneById({ id: departmentId });
        if (!department) {
            throw new NotFoundException(APP_MESSAGES.DEPARTMENT.ERROR_DEPARTMENT_NOT_FOUND);
        }
        let updatedDepartment: Department;
        if (roleIds.length == 0) {
            updatedDepartment = await this.departmentRepository.updateDepartmentRole(
                department,
                [],
            );
        }
        const matchedRoles = await this.roleService.findByIds(
            roleIds,
        );
        if (this.areBothEqualInSize(matchedRoles, roleIds)) {
            updatedDepartment = await this.departmentRepository.updateDepartmentRole(
                department,
                matchedRoles,
            );
        }
        const updatedRoleNames = updatedDepartment.roles.map(
            (role) => role.name,
        );
        return { roles: updatedRoleNames };
    }
}
