import { ModuleWithProviders, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ClientStoreService } from './client-store.service'
import { MediaStreamService } from './media-stream.service'
import { ClientConnectionService, CONFIG } from './client-connection.service'

@NgModule({
  imports: [CommonModule],
  providers: [MediaStreamService, ClientStoreService],
})
export class ClientModule {
  static forRoot(config: string): ModuleWithProviders<ClientModule> {
    return {
      ngModule: ClientModule,
      providers: [
        ClientConnectionService,
        { provide: CONFIG, useValue: config },
      ],
    }
  }
}
