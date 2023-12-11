import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './chat.schema';
import mongoose from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async getOrCreateChat(user1: string, user2: string): Promise<Chat> {
    // Check if a chat already exists between the two users
    const user1ObjId = new mongoose.Types.ObjectId(user1);
    const user2ObjId = new mongoose.Types.ObjectId(user2);
    const existingChat = await this.chatModel
      .findOne({ user1: user1ObjId, user2: user2ObjId })
      .exec();

    if (existingChat) {
      return existingChat;
    }

    // If no chat exists, create a new one
    const createdChat = new this.chatModel({
      user1: user1ObjId,
      user2: user2ObjId,
    });
    const chat = await createdChat.save();
    return chat;
  }

  async getMessagesByUsers(senderId: string, receiverId: string): Promise<any> {
    const chat = await this.chatModel.findOne({
      $or: [
        { user1: senderId, user2: receiverId },
        { user1: receiverId, user2: senderId },
      ],
    });
    return chat._id;
  }
}
