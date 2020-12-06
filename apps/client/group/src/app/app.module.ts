import { env } from './../envs/env';
import { BrowserModule } from '@angular/platform-browser'
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core'

import { UiModule, CdkModule, MaterialModule } from '@ngpeer/ui';
import { ClientModule } from '@ngpeer/client'

import { AppComponent } from './app.component'
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderComponent } from './loader/loader.component'

@NgModule({
  declarations: [AppComponent, LoaderComponent],
  imports: [
    UiModule,
    CdkModule,
    MaterialModule,
    BrowserModule,
    ReactiveFormsModule,
    ClientModule.forRoot(env.apiGateway),
    RouterModule.forRoot([], { initialNavigation: 'enabled', relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
