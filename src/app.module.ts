import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { GoogleStrategy } from './auth/google.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenMiddleware } from './middlewares/token.middleware';
import { MessageModule } from './message/message.module';
import { ProfileModule } from './profile/profile.module';
import { ChatModule } from './chat/chat.module';
import { MessageGateway } from './message/message.gateway';
dotenv.config();
@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(process.env.mongodb),
    MessageModule,
    ProfileModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GoogleStrategy,
    ConfigService,
    JwtService,
    // MessageGateway,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // token middleware
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: 'auth/google', method: RequestMethod.ALL },
        { path: 'auth/google/callback', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
