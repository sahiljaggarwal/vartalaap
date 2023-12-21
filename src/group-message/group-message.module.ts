import { Module } from '@nestjs/common';
import { GroupMessageController } from './group-message.controller';
import { GroupMessageService } from './group-message.service';
import { GroupMessageGateway } from './group-message-gateway';
import { ProfileModule } from 'src/profile/profile.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupMessage, groupMessageSchema } from './group-message.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ProfileModule,
    GroupMessageModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: GroupMessage.name,
        schema: groupMessageSchema,
      },
    ]),
  ],
  controllers: [GroupMessageController],
  providers: [GroupMessageService, GroupMessageGateway],
})
export class GroupMessageModule {}
