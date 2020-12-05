import { NavigationEnd, Router } from '@angular/router'
import { Inject, Injectable } from '@angular/core'
import { filter, take } from 'rxjs/operators'
import { DOCUMENT } from '@angular/common'
import {
  style,
  animate,
  AnimationPlayer,
  AnimationBuilder,
} from '@angular/animations'

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  splashScreenEl: any
  player: AnimationPlayer

  constructor(
    private _animationBuilder: AnimationBuilder,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router
  ) {
    // Initialize
    // this._init();
  }


  public onInit() {
    this._init()
  }
  /**
   * Initialize
   *
   * @private
   */
  private _init(): void {
    // Get the splash screen element
    this.splashScreenEl = this._document.body.querySelector(
      'sample-loader'
    )

    // If the splash screen element exists...
    // if (this.splashScreenEl) {
    //   // Hide it on the first NavigationEnd event
    //   this._router.events
    //     .pipe(
    //       filter((event) => event instanceof NavigationEnd),
    //       take(1)
    //     )
    //     .subscribe(() => {
    //       setTimeout(() => {
    //         this.hide()
    //       })
    //     })
    // }
  }

  /**
   * Show the splash screen
   */
  show(): void {
    this.player = this._animationBuilder
      .build([
        style({
          opacity: '0',
          zIndex: '99999',
        }),
        animate('400ms ease', style({ opacity: '1' })),
      ])
      .create(this.splashScreenEl)

    setTimeout(() => {
      this.player.play()
    }, 0)
  }

  /**
   * Hide the splash screen
   */
  hide(): void {
    this.player = this._animationBuilder
      .build([
        style({ opacity: '1' }),
        animate(
          '400ms ease',
          style({
            opacity: '0',
            zIndex: '-10',
          })
        ),
      ])
      .create(this.splashScreenEl)

    setTimeout(() => {
      this.player.play()
    }, 0)
  }
}
