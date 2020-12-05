import { PeerClient } from '@ngpeer/core'
import { AfterViewInit, Component } from '@angular/core'
import { ClientConnectionService, ClientStoreService } from '@ngpeer/client'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

@Component({
  selector: 'sample-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'client-group'

  public peerClients: PeerClient[]

  photos = [
    'assets/photo1.png',
    'assets/photo2.png',
    'assets/photo3.png',
  ]

  constructor(
    private clientStoreService: ClientStoreService,
    private connectionService: ClientConnectionService,
    private sanitizer: DomSanitizer
  ) {
    this.clientStoreService.clients$.subscribe(
      (clientList) => (this.peerClients = clientList.toArray()),
      (err) => console.error('Error updating the client list:', err)
    )
  }

  public getVideoStreamURL(stream: MediaStream): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(stream)
    )
  }

  ngAfterViewInit(): void {
    // this.connectionService.connectToRoom()
  }
}
