import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './group.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { GroupDto } from 'src/dtos/group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}

  // create group
  async createGroup(adminId: string, groupDto: GroupDto): Promise<Group> {
    if (!groupDto.name) {
      throw new BadRequestException('Name is required');
    }
    const group = await new this.groupModel({
      name: groupDto.name,
      admin: adminId,
      members: [adminId],
      description: groupDto.description,
    });
    await group.save();
    return group;
  }

  // add group member
  async addGroupMember(memberId: any, groupId: string): Promise<Group> {
    const existingGroup = await this.groupModel.findOne({ _id: groupId });
    if (!existingGroup) {
      throw new NotFoundException('Group not found');
    }
    const memberObjId = new mongoose.Types.ObjectId(memberId);
    if (existingGroup.members.includes(memberObjId)) {
      throw new BadRequestException('Member already exists');
    }
    existingGroup.members.push(memberObjId);
    await existingGroup.save();
    return existingGroup;
  }

  // get groups list
  async getJoinGroupList(userId: string): Promise<any> {
    const groups = await this.groupModel
      .aggregate([
        {
          $match: {
            members: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'members',
            foreignField: '_id',
            as: 'membersDetails',
          },
        },
        {
          $project: {
            membersDetails: 0,
          },
        },
      ])
      .exec();
    if (!groups) {
      throw new NotFoundException('Group not found');
    }
    console.log('groups', groups);
    return groups;
  }
}
