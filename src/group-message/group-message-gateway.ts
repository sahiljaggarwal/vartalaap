import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { GroupMessageDto } from 'src/dtos/group-message.dto';
import { ProfileService } from 'src/profile/profile.service';
import { GroupMessageService } from './group-message.service';

@WebSocketGateway({ namespace: '/group-message' })
export class GroupMessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private readonly groupMessageService: GroupMessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  private readonly rooms = new Map<string, Set<string>>();

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authorization?.split('Bearer ')[1];
    const user = await this.authService.verifyToken(token);
    if (!user) {
      client.disconnect(true);
      return;
    }
    const isOnline = await this.profileService.changeToOnlineStatus(user._id);
    console.log('Client connected', client.id);
  }

  // Implement the missing handleDisconnect method
  async handleDisconnect(client: Socket) {
    const token = client.handshake.headers.authorization?.split('Bearer ')[1];
    const user = await this.authService.verifyToken(token);
    if (!user) {
      client.disconnect(true);
      return true;
    }
    const isOffline = await this.profileService.changeToOfflineStatus(user._id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() messageData: GroupMessageDto,
  ): Promise<any> {
    let { groupId, senderId } = messageData;
    this.server.socketsJoin(groupId);
    const userProfile = await this.profileService.getProfileById(senderId);
    this.server
      .to(groupId)
      .emit(
        'joinRoom',
        `User: @${userProfile.username} joined the room ${groupId}`,
      );
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() messageData: GroupMessageDto,
  ): Promise<any> {
    const { group_message, groupId, senderId } = messageData;
    const userProfile = await this.profileService.getProfileById(senderId);
    this.server
      .to(groupId)
      .emit(
        'receiveMessage',
        `${group_message} (User: @${userProfile.username})`,
      );
    await this.groupMessageService.createGroupMessage(messageData);
  }
}
