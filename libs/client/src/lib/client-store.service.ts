import { Observable, BehaviorSubject } from 'rxjs'
import { Injectable } from '@angular/core'
import { PeerClient } from '@ngpeer/core'
import { List } from 'immutable'

@Injectable()
export class ClientStoreService {
  private _clients: BehaviorSubject<List<PeerClient>> = new BehaviorSubject(
    List([])
  )

  public get clients$(): Observable<List<PeerClient>> {
    return this._clients.asObservable()
  }

  public addClient(newClient: PeerClient): void {
    this._clients.next(this._clients.getValue().push(newClient))
  }

  public removeClient(clientId: string): void {
    const clientList = this._clients.getValue()
    const removeIndex = clientList.findIndex((c) => c.id === clientId)
    this._clients.next(clientList.remove(removeIndex))
  }
}
