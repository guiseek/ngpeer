import { PeerAction } from '@ngpeer/core'
import { Client, Server, Socket } from 'socket.io'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(socket: Socket, ...args: any[]) {
    console.log(`Client ${socket.id} connected to room`)
  }
  handleDisconnect(socket: Socket) {
    socket.broadcast.emit(PeerAction.Disconnected, { id: socket.id })
  }

  @SubscribeMessage(PeerAction.Data)
  onPeerMessage(socket: Socket, data: any) {
    console.log('Forward WebRTC peer message:', JSON.stringify(data))
    socket.broadcast.emit(PeerAction.Data, data)
  }

  @SubscribeMessage(PeerAction.ConnectToRoom)
  onPeerConnect(socket: Socket, data: any) {
    console.log(`Client ${socket.id} connected to room`)
    socket.broadcast.emit(PeerAction.Connected, { id: socket.id })
  }
}
