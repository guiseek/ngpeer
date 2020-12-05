import { createIceObject, createSdpObject, isChrome } from './client.utilities'
import { Inject, Injectable, InjectionToken } from '@angular/core'
import { ClientStoreService } from './client-store.service'
import { MediaStreamService } from './media-stream.service'
import { PeerAction, PeerClient } from '@ngpeer/core'
import * as io from 'socket.io-client'

export const CONFIG = new InjectionToken<string>('ClientConfig')

@Injectable({
  providedIn: 'root',
})
export class ClientConnectionService {
  private socket: SocketIOClient.Socket
  private peerConnections: RTCPeerConnection[] = []
  private myMediaStream: MediaStream
  private peerId: string

  constructor(
    private clientStore: ClientStoreService,
    private mediaStream: MediaStreamService,
    @Inject(CONFIG) private config: string
  ) {
    this.socket = io.connect(this.config)

    this.socket.on('connect', () => {
      console.log('connect')
      this.peerId = this.socket.id
    })

    this.socket.on('disconnect', (data) => {
      console.log('disconnect: ', data)
    })

    this.socket.on(PeerAction.Connected, ({ id }) => this.makeOffer(id))
    this.socket.on(PeerAction.Data, (data) => this.handlePeerData(data))
    this.socket.on(PeerAction.Disconnected, ({ id }) => this.remove(id))
  }

  private async makeOffer(id: string) {
    const peerConnection = this.getPeerConnection(id)

    const options: RTCOfferOptions = {
      offerToReceiveVideo: true,
      offerToReceiveAudio: true,
    }

    const sdp = await peerConnection.createOffer(options)
    await peerConnection.setLocalDescription(sdp)
    const data = createSdpObject(this.peerId, id, sdp, PeerAction.Offer)
    this.socket.emit(PeerAction.Data, data)
  }

  private remove(id: string) {
    this.clientStore.removeClient(id)
  }

  public async connectToRoom() {
    const stream = await this.mediaStream.getMediaStream()
    this.myMediaStream = stream
    this.socket.emit(PeerAction.ConnectToRoom)
    const client = new PeerClient({
      id: this.socket.id,
      stream: this.myMediaStream,
      controls: true,
      muted: true,
    })
    this.clientStore.addClient(client)
    //.catch((err) => console.error("Can't get media stream", err))
  }

  private async handlePeerData({ type, by, sdp, ice }) {
    const peerConnection = this.getPeerConnection(by)

    switch (type) {
      case PeerAction.Offer: {
        const description = new RTCSessionDescription(sdp)
        await peerConnection.setRemoteDescription(description)

        console.log('Setting remote description by offer')

        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        const data = createSdpObject(this.peerId, by, answer, PeerAction.Answer)
        this.socket.emit(PeerAction.Data, data)
        break
        /*catch((err) => {console.error('Error on SDP-Offer:', err)})*/
      }

      case PeerAction.Answer: {
        const description = new RTCSessionDescription(sdp)
        await peerConnection.setRemoteDescription(description)
        break
        /*.catch((err) => console.error('Error on SDP-Answer:', err))*/
      }
      case PeerAction.Ice: {
        if (ice) {
          console.log('Adding ice candidate')
          await peerConnection.addIceCandidate(ice)
        }
        break
      }
    }
  }

  private getPeerConnection(id: string): RTCPeerConnection {
    if (this.peerConnections[id]) {
      return this.peerConnections[id]
    }

    const peerConnection = new RTCPeerConnection()
    this.peerConnections[id] = peerConnection

    peerConnection.addEventListener('icecandidate', ({ candidate }) => {
      const data = createIceObject(this.peerId, id, candidate, PeerAction.Ice)
      this.socket.emit(PeerAction.Data, data)
    })

    peerConnection.addEventListener('negotiationneeded', () => {
      console.log('Need negotiation:', id)
    })

    peerConnection.addEventListener('signalingstatechange', () => {
      console.log(
        'ICE signaling state changed to:',
        peerConnection.signalingState,
        'for client',
        id
      )
    })

    /**
     * @deprecated in Chrome
     * @see https://github.com/webrtc/adapter/issues/361
     * https://developer.mozilla.org/de/docs/Web/API/RTCPeerConnection/addStream
     */
    if (isChrome) {
      //
      peerConnection.addStream(this.myMediaStream)
      peerConnection.onaddstream = ({ stream }) => {
        console.log('Received new stream')
        const client = new PeerClient({ id: id, stream })
        this.clientStore.addClient(client)
      }
    } else {
      const [track] = this.myMediaStream.getVideoTracks()
      peerConnection.addTrack(track, this.myMediaStream)
      peerConnection.ontrack = (event: RTCTrackEvent) => {
        console.log('Received new stream')
        const client = new PeerClient({ id: id, stream: event.streams[0] })
        this.clientStore.addClient(client)
      }
    }
    return peerConnection
  }
}
