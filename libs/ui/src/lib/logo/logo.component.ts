import { Component, OnInit, ChangeDetectionStrategy, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'ngpeer-logo',
  templateUrl: './logo.component.svg',
  styleUrls: ['./logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent implements OnInit {

  private _water = '#03a9f4';
  public get water() {
    return this._water;
  }
  @Input()
  public set water(value) {
    this._water = value;
  }

  private _earth = '#303f9f';
  public get earth() {
    return this._earth;
  }
  @Input()
  public set earth(value) {
    this._earth = value;
  }

  private _lines = '#ffffff';
  public get lines() {
    return this._lines;
  }
  @Input()
  public set lines(value) {
    this._lines = value;
  }

  constructor(private elRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    console.log(this.elRef.nativeElement);
  }

}
