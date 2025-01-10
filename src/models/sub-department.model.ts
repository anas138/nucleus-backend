import { Department } from "src/entities/department.entity";
import { User } from "src/entities/user.entity";

export class SubDepartmentCreatedModel {
    name: string;
    department?: Department;
    created_by?: number;
    updated_by?: number;
}


export class FetchSubDepartmentModel {
    id: number;
    name: string;
    users?: User[];
    created_by?: number;
    updated_by?: number;
    created_at?: Date;
    updated_at?: Date;
}
export class FetchSubDepartmentUsersModel {
    roles: string[]
}