import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDto } from 'src/dtos/message.dto';
import { Message, MessageSchema } from './message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(
    messageDto: MessageDto,
    senderUserId: any,
    receiverId: any,
    chatId: any,
  ): Promise<Message> {
    const { content } = messageDto;
    const createdMessage = await new this.messageModel({
      content,
      sender: senderUserId,
      receiver: receiverId,
      chat: chatId,
    });
    console.log('createdMessage', createdMessage);
    return createdMessage.save();
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return this.messageModel.find({ chat: chatId }).exec();
  }
}
