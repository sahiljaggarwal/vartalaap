import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Friend, friendSchema } from './friend.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Friend.name,
        schema: friendSchema,
      },
    ]),
  ],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService, MongooseModule],
})
export class FriendModule {}
