import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.schema';
import { ChatModule } from 'src/chat/chat.module';
import { ChatService } from 'src/chat/chat.service';
import { MessageGateway } from './message.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    ChatModule,
    AuthModule,
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    ChatService,
    MessageGateway,
    JwtService,
    ConfigService,
    AuthService,
  ],
  exports: [MongooseModule],
})
export class MessageModule {}
