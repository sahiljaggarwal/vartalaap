import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './message.schema';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
@WebSocketGateway(4001, { namespace: '/message' })
export class MessageGateway implements OnGatewayConnection {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService, // Inject your ChatService
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleConnection(
    @ConnectedSocket() client: Socket,
    @MessageBody() receiverId: any,
    // ...args: any[],
  ) {
    // const [payload] = args;
    console.log(receiverId);
    if (receiverId) {
      console.log(receiverId);
      this.handleConnect(client, receiverId);
    } else {
      console.log('Payload is undefined');
      // Handle the case when payload is not present
    }
    // this.handleConnect(client, payload);
  }

  private async handleConnect(client: Socket, receiverId: any) {
    // Extract senderId from JWT token
    const token = client.handshake.headers.authorization.split(' ')[1];
    const decodedPayload = this.jwtService.decode(token);
    const senderId = decodedPayload._id;

    // Parse the JSON payload
    console.log('payload: ', receiverId);
    // const messageData = JSON.parse(receiverId);

    // Access data from the payload
    // const receiverId = messageData.receiverId;

    // Generate chat room ID based on sender and receiver IDs
    const chatId = await this.chatService.getOrCreateChat(senderId, receiverId);
    const chatActualId = chatId['_id'];
    // console.log('chatAcctualId', chatAcctualId);
    const chatRoomId = chatActualId.toString();
    console.log('chatRoomId -> 1', chatRoomId);

    // Join the client to the chat room
    client.join(chatRoomId);
  }
}
