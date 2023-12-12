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

  async getOrCreateChat(sender: any, receiver: any): Promise<Chat> {
    // Check if a chat already exists between the two users
    const senderObjId = new mongoose.Types.ObjectId(sender);
    const receiverObjId = new mongoose.Types.ObjectId(receiver);
    const existingChat = await this.chatModel
      .findOne({
        $or: [
          { sender: senderObjId, receiver: receiverObjId },
          { sender: receiverObjId, receiver: senderObjId },
        ],
      })
      .exec();

    console.log('existChat: ', existingChat);
    if (existingChat) {
      return existingChat;
    }

    // If no chat exists, create a new one
    console.log('ye code chal rha hai bhai');
    const createdChat = new this.chatModel({
      sender: senderObjId,
      receiver: receiverObjId,
    });
    const chat = await createdChat.save();
    console.log('new created chat, id: ', chat);
    return chat;
  }

  async getMessagesByUsers(senderId: string, receiverId: string): Promise<any> {
    const chat = await this.chatModel.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });
    return chat._id;
  }
}
