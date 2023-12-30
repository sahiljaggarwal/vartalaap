import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Friend } from './friend.schema';
import { Model } from 'mongoose';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(Friend.name) private readonly friendModel: Model<Friend>,
  ) {}

  async sendFriendRequest(userId: any, friendId: string): Promise<any> {
    const friend = await this.friendModel.findOne({ friends: friendId });
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }
    if (friend.friends.includes(userId)) {
      throw new BadRequestException('Already friends');
    }
    if (friend.requests.includes(userId)) {
      throw new BadRequestException('Already sent request');
    }
    friend.requests.push(userId);
    return friend;
  }

  async acceptFriendRequest(userId: any, friendId: any): Promise<any> {
    const requests = await this.friendModel.findOne({ userId: userId });
    if (!requests) {
      throw new NotFoundException('Requests Not Found...');
    }
    if (requests.friends.includes(friendId)) {
      throw new BadRequestException('Already friends');
    }
    if (!requests.requests.includes(friendId)) {
      throw new BadRequestException('Request not found');
    }

    // accept friend request
    requests.friends.push(friendId);

    // remove request from request list
    requests.requests.filter((item) => item !== friendId);
    return requests;
  }

  async rejectFriendRequest(userId: any, friendId: any): Promise<any> {
    const requests = await this.friendModel.findOne({ userId: userId });
    if (!requests) {
      throw new NotFoundException('Requests Not Found...');
    }
    if (!requests.requests.includes(friendId)) {
      throw new BadRequestException('Request Not Found');
    }
    if (requests.friends.includes(friendId)) {
      throw new BadRequestException('Already friends');
    }
    requests.requests.filter((item) => item !== friendId);
    return requests;
  }

  async blockedFriend(userId: any, friendId: any): Promise<any> {
    const friend = await this.friendModel.findOne({ userId: userId });
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }
    if (friend.blocked.includes(friendId)) {
      throw new BadRequestException('Already blocked');
    }
    friend.blocked.push(friendId);
    return friend;
  }

  async seeFriendRequests(userId: any): Promise<any> {
    const friend = await this.friendModel
      .findOne({ userId: userId })
      .select({ requests: 1, _id: 1 });
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }
    return friend;
  }

  async seeBlockList(userId: any): Promise<any> {
    const friend = await this.friendModel
      .findOne({ userId: userId })
      .select({ blocked: 1, _id: 1 });
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }
    return friend;
  }
}
