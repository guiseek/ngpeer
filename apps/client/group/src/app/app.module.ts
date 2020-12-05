import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { ClientModule } from '@ngpeer/client'

import { AppComponent } from './app.component'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ClientModule.forRoot('http://localhost:3000'),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
