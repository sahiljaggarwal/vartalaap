import {
  Controller,
  Post,
  HttpCode,
  Body,
  Req,
  Patch,
  Param,
  Get,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { ErrorResponse } from 'src/common/ErrorResponse';
import { GroupDto } from 'src/dtos/group.dto';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  // Create Group
  @Post('create')
  @HttpCode(201)
  async createGroup(
    @Body() groupDto: GroupDto,
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const adminId = req['user']._id;
      const result = await this.groupService.createGroup(
        adminId,
        groupDto,
        // image,
      );
      return new SuccessResponse({ message: 'group created', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Add Group Member
  @Patch('add/:memberId/:groupId')
  @HttpCode(200)
  async addMembers(
    @Param('memberId') memberId: string,
    @Param('groupId') groupId: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.groupService.addGroupMember(memberId, groupId);
      return new SuccessResponse({ message: 'member added', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Get Joined Groups
  @Get('join')
  @HttpCode(200)
  async getJoinGroupList(
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.groupService.getJoinGroupList(userId);
      return new SuccessResponse({ message: 'Joined Groups', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }
}
