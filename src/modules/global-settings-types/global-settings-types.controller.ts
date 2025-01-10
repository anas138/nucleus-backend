import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GlobalSettingsTypesService } from './global-settings-types.service';
import { AuthGuard } from '@nestjs/passport';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { CreateGlobalSettingsTypesDto } from 'src/dto/global-setting-types/create-global-settings-types.dto';
import { GlobalSettingsTypesModel } from 'src/models/global-settings-types.model';

@Controller('global-settings-types')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class GlobalSettingsTypesController {
  constructor(
    private readonly globalSettingsTypesService: GlobalSettingsTypesService,
  ) {}

  @Post()
  async CreateGlobalSettingsTypes(
    @Body() createGlobalSettingsTypes: CreateGlobalSettingsTypesDto,
  ): Promise<GlobalSettingsTypesModel> {
    return this.globalSettingsTypesService.create(createGlobalSettingsTypes);
  }

  @Get()
  async getAllTypes() {
    return this.globalSettingsTypesService.findAll();
  }
}
