import { PeerClient } from '@ngpeer/core'
import { AfterViewInit, Component } from '@angular/core'
import { BreakpointObserver } from '@angular/cdk/layout'
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
  isSmallScreen = this.breakpointObserver.isMatched('(max-width: 599px)');
  breakpoints$ = this.breakpointObserver.observe('')
  constructor(
    private connectionService: ClientConnectionService,
    private clientStoreService: ClientStoreService,
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer
  ) {
    this.clientStoreService.clients$.subscribe(
      (clientList) => {
        console.log(clientList);

        this.peerClients = clientList.toArray()
      },
      (err) => console.error('Error updating the client list:', err)
    )
  }

  public getVideoStreamURL(stream: MediaStream): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(stream)
    )
  }
  connect() {
    this.connectionService.connectToRoom()
  }
  ngAfterViewInit(): void {

  }
}
