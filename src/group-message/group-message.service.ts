import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { GroupMessageDto } from 'src/dtos/group-message.dto';
import { GroupMessage, groupMessageSchema } from './group-message.schema';

@Injectable()
export class GroupMessageService {
  constructor(
    @InjectModel(GroupMessage.name)
    private readonly groupMessageModel: Model<GroupMessage>,
  ) {}

  async createGroupMessage(groupDto: GroupMessageDto): Promise<any> {
    const { group_message, senderId, groupId } = groupDto;
    const groupChatObjId = new mongoose.Types.ObjectId(groupId);
    const createGroupMessage = await new this.groupMessageModel({
      group_message,
      senderId: senderId,
      groupId: groupChatObjId,
    });
    return await createGroupMessage.save();
  }

  async getGroupMessages(groupId: string): Promise<any> {
    console.log('groupId: ', groupId);
    const group = await this.groupMessageModel
      .find({ groupId: groupId })
      .exec();
    console.log('group: ', group);
    return group;
  }
}
