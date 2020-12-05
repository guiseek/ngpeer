import { PeerAction } from '@ngpeer/core'

export const createSdpObject = (
  by: string,
  to: string,
  sdp: RTCSessionDescriptionInit,
  type: PeerAction
) => ({ by, to, sdp, type })

export const createIceObject = (
  by: string,
  to: string,
  ice: RTCIceCandidate,
  type: PeerAction
) => ({ by, to, ice, type })

export const isChrome =
  window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1
