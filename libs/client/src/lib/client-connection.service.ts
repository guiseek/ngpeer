import { Inject, Injectable, InjectionToken } from '@angular/core'
import { ClientStoreService } from './client-store.service'
import { MediaStreamService } from './media-stream.service'
import { PeerAction, PeerClient } from '@ngpeer/core'
import * as io from 'socket.io-client'
import adapter from 'webrtc-adapter'

declare global {
  interface RTCPeerConnection {
    onaddstream: (evt: MediaStreamEvent) => void
    onremovestream: (evt: Event) => void
    addStream(stream: MediaStream): void
  }
}

export const CONFIG = new InjectionToken<string>('ClientConfig')

@Injectable({
  providedIn: 'root',
})
export class ClientConnectionService {
  private socket: SocketIOClient.Socket
  private peerConnections: RTCPeerConnection[] = []
  private myMediaStream: MediaStream = undefined
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

    this.socket.on('disconnect', () => {
      console.log('disconnect')
    })

    this.socket.on(PeerAction.Connected, ({ id }) => this.makeOffer(id))
    this.socket.on(PeerAction.Data, (data) => this.handlePeerData(data))
    this.socket.on(PeerAction.Disconnected, (data) => console.log(data))
  }

  private makeOffer(clientId: string) {
    const peerConnection = this.getPeerConnection(clientId)

    const options: RTCOfferOptions = {
      offerToReceiveVideo: true,
      offerToReceiveAudio: true,
    }

    peerConnection
      .createOffer(options)
      .then(async (sdp: RTCSessionDescriptionInit) => {
        return peerConnection.setLocalDescription(sdp).then(() => {
          this.socket.emit(PeerAction.Data, {
            by: this.peerId,
            to: clientId,
            sdp: sdp,
            type: PeerAction.Offer,
          })
        })
      })
  }

  public connectToRoom() {
    this.mediaStream
      .getMediaStream()
      .then((stream: MediaStream) => {
        this.myMediaStream = stream
        this.socket.emit(PeerAction.ConnectToRoom)

        /**
         * Add my self to the list */
        this.clientStore.addClient(
          new PeerClient({
            id: this.socket.id,
            stream: this.myMediaStream,
          })
        )
      })
      .catch((err) => console.error("Can't get media stream", err))
  }

  private handlePeerData(message) {
    const peerConnection = this.getPeerConnection(message.by)

    switch (message.type) {
      case PeerAction.Offer:
        peerConnection
          .setRemoteDescription(new RTCSessionDescription(message.sdp))
          .then(() => {
            console.log('Setting remote description by offer')
            return peerConnection
              .createAnswer()
              .then((sdp: RTCSessionDescriptionInit) => {
                return peerConnection.setLocalDescription(sdp).then(() => {
                  this.socket.emit(PeerAction.Data, {
                    by: this.peerId,
                    to: message.by,
                    sdp: sdp,
                    type: PeerAction.Answer,
                  })
                })
              })
          })
          .catch((err) => {
            console.error('Error on SDP-Offer:', err)
          })
        break
      case PeerAction.Answer:
        peerConnection
          .setRemoteDescription(new RTCSessionDescription(message.sdp))
          .then(() => console.log('Setting remote description by answer'))
          .catch((err) => console.error('Error on SDP-Answer:', err))
        break
      case PeerAction.Ice:
        if (message.ice) {
          console.log('Adding ice candidate')
          peerConnection.addIceCandidate(message.ice)
        }
        break
    }
  }

  private getPeerConnection(id: string): RTCPeerConnection {
    if (this.peerConnections[id]) {
      return this.peerConnections[id]
    }

    const peerConnection = new RTCPeerConnection()
    this.peerConnections[id] = peerConnection

    peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      this.socket.emit(PeerAction.Data, {
        by: this.peerId,
        to: id,
        ice: event.candidate,
        type: PeerAction.Ice,
      })
    }

    peerConnection.onnegotiationneeded = () => {
      console.log('Need negotiation:', id)
    }

    peerConnection.onsignalingstatechange = () => {
      console.log(
        'ICE signaling state changed to:',
        peerConnection.signalingState,
        'for client',
        id
      )
    }

    /**
     * @deprecated in Chrome
     * @see https://github.com/webrtc/adapter/issues/361
     * https://developer.mozilla.org/de/docs/Web/API/RTCPeerConnection/addStream
     */
    if (adapter.browserDetails.browser.indexOf('chrome') > -1) {
      //
      peerConnection.addStream(this.myMediaStream)
      peerConnection.onaddstream = ({ stream }) => {
        console.log('Received new stream')
        const client = new PeerClient({ id: id, stream })
        this.clientStore.addClient(client)
      }
    } else {
      peerConnection.addTrack(
        this.myMediaStream.getVideoTracks()[0],
        this.myMediaStream
      )
      peerConnection.ontrack = (event: RTCTrackEvent) => {
        console.log('Received new stream')
        const client = new PeerClient({ id: id, stream: event.streams[0] })
        this.clientStore.addClient(client)
      }
    }

    return peerConnection
  }
}
