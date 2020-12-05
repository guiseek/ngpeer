import { TestBed } from '@angular/core/testing'

import { ClientConnectionService } from './client-connection.service'

describe('ClientConnectionService', () => {
  let service: ClientConnectionService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ClientConnectionService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
