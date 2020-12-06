import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { PlatformModule } from '@angular/cdk/platform';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  exports: [
    A11yModule,
    LayoutModule,
    DragDropModule,
    PlatformModule,
  ]
})
export class CdkModule { }
