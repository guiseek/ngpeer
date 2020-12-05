import { PeerAction } from '@ngpeer/core'
import { Client, Server, Socket } from 'socket.io'
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

@WebSocketGateway()
export class AppGateway {

  @SubscribeMessage(PeerAction.Data)
  onPeerMessage(socket: Socket, data: any) {
    console.log('Forward WebRTC peer message:', JSON.stringify(data))
    socket.broadcast.emit(PeerAction.Data, data)
  }

  @SubscribeMessage(PeerAction.ConnectToRoom)
  onPeerConnect(socket: Socket, data: any) {
    console.log(`Client ${socket.id} connected to room`)
    socket.broadcast.emit(PeerAction.Connected, {
      id: socket.id,
    })
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!'
  }
}
