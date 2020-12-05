import { Immutable } from './immutable.model'

export interface IPeerClient {
  id?: string
  owner?: boolean
  muted?: boolean
  controls?: boolean
  stream: MediaStream
}

export class PeerClient extends Immutable<IPeerClient, PeerClient> {
  constructor(data: IPeerClient) {
    super(PeerClient, data)
  }

  get id(): string {
    return this.data.get('id')
  }

  get stream(): MediaStream {
    return this.data.get('stream')
  }

  get controls(): boolean {
    return this.data.get('controls')
  }

  get muted(): boolean {
    return this.data.get('muted')
  }

  setId(val: string): PeerClient {
    return this.setValue('id', val)
  }

  setStream(val: MediaStream): PeerClient {
    return this.setValue('stream', val)
  }

  setControls(val: boolean): PeerClient {
    return this.setValue('controls', val)
  }

  setMuted(val: boolean): PeerClient {
    return this.setValue('muted', val)
  }
}

declare global {
  interface RTCPeerConnection {
    onaddstream: (evt: MediaStreamEvent) => void
    onremovestream: (evt: Event) => void
    addStream(stream: MediaStream): void
  }
}
