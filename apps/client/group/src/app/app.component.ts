import { LoaderService } from './loader/loader.service';
import { ClientConnectionService, ClientStoreService } from '@ngpeer/client'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { AfterViewInit, Component, OnInit } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { map } from 'rxjs/operators'

@Component({
  selector: 'sample-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = '@ngpeer'
  public peerClients$ = this.clientStoreService.clients$.pipe(
    map((clientList) => clientList.toArray())
  )
  isSmallScreen = this.breakpointObserver.isMatched('(max-width: 599px)')
  breakpoints$ = this.breakpointObserver.observe([
    Breakpoints.Web,
    Breakpoints.HandsetLandscape,
    Breakpoints.HandsetPortrait,
    Breakpoints.TabletLandscape,
    Breakpoints.TabletPortrait,
  ])
  constructor(
    private connectionService: ClientConnectionService,
    private clientStoreService: ClientStoreService,
    private breakpointObserver: BreakpointObserver,
    private loaderService: LoaderService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.breakpoints$.subscribe(({ matches, breakpoints }) => {
      console.log(breakpoints, matches);
    })
  }

  ngAfterViewInit() {
    this.loaderService.onInit()
    setTimeout(() => {
      this.loaderService.hide()
    }, 1000)
  }

  public getVideoStreamURL(stream: MediaStream): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(stream)
    )
  }
  connect() {
    this.connectionService.connectToRoom()
  }
}
