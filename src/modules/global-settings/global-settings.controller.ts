import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { CreateGlobalSettingsDto } from 'src/dto/global-settings/create-global-settings.dto';
import { GlobalSettingsService } from './global-settings.service';
import { UpdateGlobalSettingsDto } from 'src/dto/global-settings/update-global-settings.dto';
import { GlobalSettingsModel } from 'src/models/global-setting-model';
import { GetGlobalSettingsBySinglECondition } from 'src/dto/global-settings/get-global-settings-by-condition.dto';

@Controller('global-settings')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class GlobalSettingsController {
  constructor(private readonly globalSettingsService: GlobalSettingsService) {}

  @Put()
  async createGlobalSettingsTypes(
    @Query() query: UpdateGlobalSettingsDto,
    @Body() body: GlobalSettingsModel,
  ) {
    return this.globalSettingsService.createAndUpdate(query, body);
  }

  @Get('/:global_setting_type_id/single-by-condition')
  async getBySingleByTypAndCondition(
    @Query() query: GetGlobalSettingsBySinglECondition,
    @Param('global_setting_type_id') global_setting_type_id: number,
  ) {
    return this.globalSettingsService.findSingleSetting(
      query,
      global_setting_type_id,
    );
  }

  @Get('/:global_setting_type_id/multiple')
  async getData(
    @Param('global_setting_type_id') global_setting_type_id: number,
  ) {
    return this.globalSettingsService.findMultipleSettings(
      global_setting_type_id,
    );
  }
  @Get('/:global_setting_type_id/single-by-key')
  async getBySingleByTypeAndKey(
    @Param('global_setting_type_id') global_setting_type_id: number,
    @Query() query: GetGlobalSettingsBySinglECondition,
  ) {
    return this.globalSettingsService.findSingleSetting(
      query,
      global_setting_type_id,
    );
  }
}
