import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Req,
  Get,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ProfileDto } from 'src/dtos/profile.dto';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { ErrorResponse } from 'src/common/ErrorResponse';
import { MessageDto } from 'src/dtos/message.dto';
import { ChatService } from 'src/chat/chat.service';
// import { MessageGateway } from './message.gateway';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
  ) {}

  @Get(':receiverId')
  @HttpCode(200)
  async getMessagesByChatId(
    @Req() req: any,
    @Param('receiverId') receiverId: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    const senderId = req['user']._id;
    try {
      const chatId = await this.chatService.getMessagesByUsers(
        senderId,
        receiverId,
      );
      const result = await this.messageService.getMessages(chatId);
      return new SuccessResponse({ message: 'chat messages', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }
}
