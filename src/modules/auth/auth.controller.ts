import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginRequestDto,
  MsLoginRequestDto,
} from 'src/dto/auth/login.request.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { FetchUserModel, UserCreatedModel } from 'src/models/user.model';
import { LoginModel } from 'src/models/auth.model';
import { AuthGuard } from '@nestjs/passport';
import { FetchPermissionModel } from 'src/models/permission.model';
import { FetchRoleModel } from 'src/models/role.model';
import { ResponseMessageKey } from 'src/common/decorators/response-message.decorator';
import { UpdatePasswordDto } from 'src/dto/auth/auth.dto';
import { UserSessionService } from '../user-session/user-session.service';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES, RecordStatus } from 'src/common/enums/enums';
import { Request } from 'express';
import { UpdateUserDto } from 'src/dto/auth/auth.user.dto';
import { AuthMsTokenService } from './auth-ms-token.service';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';
import { IUserRequestInterface } from 'src/interfaces/user.request.interface';
import { IPublicRequest } from 'src/interfaces/public.request.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly authMsTokenService: AuthMsTokenService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDto,
    @Req() req: IPublicRequest,
  ): Promise<LoginModel> {
    const { username, password } = loginDto;
    const { clientInfo } = req;
    const loginResponse = await this.authService.login(
      username,
      password,
      clientInfo,
    );
    return loginResponse;
  }

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserCreatedModel> {
    return this.userService.createUser(createUserDto);
  }

  @Get('user')
  @UseGuards(AuthGuard())
  async getAuthUser(@Req() request): Promise<FetchUserModel> {
    const { user } = request;
    return this.authService.getTransformedUser(user);
  }

  @Get('user/permissions')
  @UseGuards(AuthGuard())
  async getAuthUserPermissions(
    @Req() request,
  ): Promise<FetchPermissionModel[]> {
    const { user } = request;
    return this.authService.getAuthUserPermissions(user);
  }

  @Get('user/roles')
  @UseGuards(AuthGuard())
  async getAuthUserRoles(@Req() request): Promise<FetchRoleModel[]> {
    const { user } = request;
    return this.authService.getAuthUserRoles(user);
  }

  @Post('forgot-password')
  @ResponseMessageMetadata(APP_MESSAGES.AUTH.FORGOT_PASSWORD_SUCCESS)
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('update-password')
  @ResponseMessageMetadata(APP_MESSAGES.AUTH.UPDATE_PASSWORD_SUCCESS)
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    const { token, password } = updatePasswordDto;
    return this.authService.updatePassword(token, password);
  }
  @Put('update-user')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(AuthGuard())
  @ResponseMessageMetadata(APP_MESSAGES.AUTH.UPDATE_USER_SUCCESS)
  async updateUser(@Body() updateUser: UpdateUserDto, @Req() request) {
    return this.userService.updateUser(request.user.id, updateUser);
  }
  @Post('logout')
  @UseGuards(AuthGuard())
  @ResponseMessageMetadata(APP_MESSAGES.User.LOGOUT)
  async logout(@Req() request): Promise<void> {
    const accessToken = request.headers.authorization?.split(' ')[1];
    const { user } = request;
    await this.authService.logout(accessToken, user);
  }

  @Post('update-password-api')
  @UseGuards(AuthGuard())
  async updatePasswordApi(@Req() request, @Body() body) {
    const accessToken = request.headers.authorization?.split(' ')[1];
    const { password } = body;
    return this.authService.updatePasswordApi(accessToken, password);
  }

  @Post('/ms-login')
  async msLogin(@Body() body: MsLoginRequestDto, @Req() req: IPublicRequest) {
    const { clientInfo } = req;
    const loginResponse = await this.authMsTokenService.login(body, clientInfo);

    return loginResponse;
  }
}
