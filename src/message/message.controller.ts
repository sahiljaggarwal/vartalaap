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
import { MessageGateway } from './message.gateway';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
    private readonly messageGateway: MessageGateway,
  ) {}

  // create chat messages
  @Post(':receiverId')
  @HttpCode(201)
  async createChatAndMessage(
    @Body() messageData: MessageDto,
    @Param('receiverId') receiverId: string,
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const senderUserId = req['user']._id;
      const chat = await this.chatService.getOrCreateChat(
        senderUserId,
        receiverId,
      );
      const chatId = chat['_id'];
      const createMessage = await this.messageService.createMessage(
        messageData,
        senderUserId,
        receiverId,
        chatId,
      );

      this.messageGateway.server
        .to(chatId.toString())
        .emit('newMessage', createMessage);

      return new SuccessResponse(
        { message: 'chat created', createMessage },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  @Get('getMessages/:senderId/:receiverId')
  @HttpCode(200)
  async getMessagesByChatId(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
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
