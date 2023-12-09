import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { ErrorResponse } from 'src/common/ErrorResponse';
import { ProfileDto } from 'src/dtos/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/middlewares/multer.middleware';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  //   create new profile
  @Post('create')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createProfile(
    @Body() profileData: ProfileDto,
    @UploadedFile() image: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.profileService.createProfile(
        profileData,
        image,
      );
      return new SuccessResponse(result, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // get profile by Id
  @Get(':id')
  @HttpCode(200)
  async getProfileById(
    @Param('id') id: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.profileService.getProfileById(id);
      return new SuccessResponse({ profile: 'user profile', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  @Get()
  @HttpCode(200)
  async search(
    @Query('username') username: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.profileService.search(username);
      return new SuccessResponse({ profile: 'user profile', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }
}
