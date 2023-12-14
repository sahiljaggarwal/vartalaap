import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageDto } from 'src/dtos/message.dto';
import { MessageService } from './message.service';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageService: MessageService) {}
  @WebSocketServer()
  server: Server;

  private readonly rooms = new Map<string, Set<string>>();

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() messageData: MessageDto): void {
    let { chatId, senderId } = messageData;
    this.server.socketsJoin(chatId);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() messageData: MessageDto,
  ): Promise<any> {
    const { content, chatId, senderId } = messageData;
    this.server
      .to(chatId)
      .emit('receiveMessage', `${content} (ID: ${senderId})`);
    await this.messageService.createMessage(messageData);
  }
}
