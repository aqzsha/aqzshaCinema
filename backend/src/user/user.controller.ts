import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { UserDecorator } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { User } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@UserDecorator('_id') _id: string) {
    return this.userService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  @Auth()
  async updateProfile(
    @UserDecorator('_id') _id: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.updateProfile(_id, data);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.updateProfile(id, data);
  }

  @Get('count')
  @Auth('admin')
  async getCountUsers() {
    return this.userService.getCount();
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id', IdValidationPipe) id: string) {
    return this.userService.byId(id);
  }

  @Get()
  @Auth('admin')
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.userService.getAll(searchTerm);
  }

  @Post('profile/favorites')
  @HttpCode(200)
  @Auth()
  async toggleFavorite(
    @Body('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @UserDecorator() user: User,
  ) {
    return this.userService.toggleFavorite(movieId, user);
  }

  @Get('profile/favorites')
  @Auth()
  async getFavorites(@UserDecorator('_id') _id: string) {
    return this.userService.getFavoriteMovies(_id);
  }
}
