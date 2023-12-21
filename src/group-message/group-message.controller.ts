import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { GroupMessageService } from './group-message.service';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { ErrorResponse } from 'src/common/ErrorResponse';

@Controller('group-message')
export class GroupMessageController {
  constructor(private groupMessageService: GroupMessageService) {}

  // get group messages
  @Get(':groupId')
  @HttpCode(200)
  async getGroupMessages(
    @Param('groupId') groupId: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.groupMessageService.getGroupMessages(groupId);
      return new SuccessResponse({ message: 'group messages', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }
}
