import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDto } from 'src/dtos/message.dto';
import { Message, MessageSchema } from './message.schema';
import mongoose from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(messageDto: MessageDto): Promise<Message> {
    const { content, senderId, receiverId, chatId } = messageDto;
    const chatObjId = new mongoose.Types.ObjectId(chatId);
    const createdMessage = await new this.messageModel({
      content,
      sender: senderId,
      receiver: receiverId,
      chat: chatObjId,
    });
    console.log('createdMessage', createdMessage);
    return createdMessage.save();
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return this.messageModel.find({ chat: chatId }).exec();
  }
}
