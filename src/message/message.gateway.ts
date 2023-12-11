// message.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const userId = client.handshake.query.userId || null;

    if (userId) {
      // If userId is available, set it as the client ID
      client.data = { userId };
      console.log(`Client connected: ${userId}`);
    } else {
      // If userId is not available, disconnect the client
      console.log('Unauthorized connection. Disconnecting.');
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId || null;
    console.log(`Client disconnected: ${userId}`);
  }

  // Add methods to handle WebSocket events

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: { room: string }) {
    const userId = client.data?.userId || null;

    if (userId) {
      client.join(data.room);
      console.log(`Client ${userId} joined room ${data.room}`);
    }
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(client: Socket, data: { room: string; message: any }) {
    const userId = client.data?.userId || null;

    if (userId) {
      this.server.to(data.room).emit('newMessage', data.message);
    }
  }
}
