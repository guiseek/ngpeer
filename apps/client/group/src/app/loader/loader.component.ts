import { Component, OnInit, ChangeDetectionStrategy, ElementRef } from '@angular/core';

@Component({
  selector: 'sample-loader',
  templateUrl: './loader.component.svg',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit {

  constructor(private elRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    console.log(this.elRef.nativeElement);
  }

}
