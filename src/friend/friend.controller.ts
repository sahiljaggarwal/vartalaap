import {
  Controller,
  Post,
  Get,
  Patch,
  HttpCode,
  Req,
  Param,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { ErrorResponse } from 'src/common/ErrorResponse';

@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  // send Friend Request
  @Post('send/:friendId')
  @HttpCode(201)
  async sendFriendRequest(
    @Req() req: any,
    @Param('friendId') friendId: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.friendService.sendFriendRequest(
        userId,
        friendId,
      );
      return new SuccessResponse(
        { message: 'Friend Request Sent Successfully', result },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // accept Friend Request
  @Patch('accept/:friendId')
  @HttpCode(201)
  async acceptFriendRequest(
    @Req() req: any,
    @Param('friendId') friendId: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.friendService.acceptFriendRequest(
        userId,
        friendId,
      );
      return new SuccessResponse(
        { message: 'Friend Request Accepted Successfully', result },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // reject friend Request
  @Patch('reject/:friendId')
  @HttpCode(201)
  async rejectFriendRequest(
    @Req() req: any,
    @Param('friendId') friendId: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.friendService.rejectFriendRequest(
        userId,
        friendId,
      );
      return new SuccessResponse(
        { message: 'Friend Request Rejected Successfully', result },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // get Friend List
  @Get()
  @HttpCode(200)
  async seeFriends(
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.friendService.seeFriendRequests(userId);
      return new SuccessResponse({ message: 'Friend List', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // block Friend
  @Patch('block/:friendId')
  @HttpCode(201)
  async blockedFriend(
    @Req() req: any,
    @Param('friendId') friendId: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.friendService.blockedFriend(userId, friendId);
      return new SuccessResponse(
        { message: 'Friend Blocked Successfully', result },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // get Blocked List
  @Get('blocked')
  @HttpCode(200)
  async blockedList(
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.friendService.seeBlockList(userId);
      return new SuccessResponse({ message: 'Blocked List', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }
}
