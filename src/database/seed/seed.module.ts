import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { UserSeeder } from './user.seed';
import { EnvironmentConfigModule } from 'src/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';
import { RoleSeeder } from './role.seed';
import { UserModule } from 'src/modules/user/user.module';
import { RoleModule } from 'src/modules/role/role.module';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { RolePermissionSeeder } from './role-permission.seed';
import { CountryProvinceCitySeeder } from './country-city-province.seed';
import { City } from 'src/entities/city.entity';
import { Country } from 'src/entities/country.entity';
import { Province } from 'src/entities/province.entity';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { CityModule } from 'src/modules/city/city.module';
import { CountryModule } from 'src/modules/country/country.module';
import { ProvinceModule } from 'src/modules/province/province.module';
import { PermissionSeeder } from './permission.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, City, Country, Province]),
    EnvironmentConfigModule,
    UserModule,
    RoleModule,
    PermissionModule,
    CityModule,
    CountryModule,
    ProvinceModule,
  ],
  controllers: [],
  providers: [
    UserSeeder,
    RoleSeeder,
    PermissionSeeder,
    RolePermissionSeeder,
    CountryProvinceCitySeeder,
    HelperFunctions,
  ],
})
export class SeedModule implements OnModuleInit {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly roleSeeder: RoleSeeder,
    private readonly permissionSeeder: PermissionSeeder,
    private readonly rolePermissionSeeder: RolePermissionSeeder,
    private readonly env: EnvironmentConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.env.getRUN_SEED()) {
      this.runSeeds();
      // this.countryProvinceCitySeeder.populateWorldData();
    }
  }
  async runSeeds(): Promise<void> {
    try {
      const roleId = await this.roleSeeder.seed();
      const permissionIds = await this.permissionSeeder.seed();
      await this.rolePermissionSeeder.seed(roleId, permissionIds);
      await this.userSeeder.seed();
    } catch (error) {
      console.log(error.message);
    }
  }
}
