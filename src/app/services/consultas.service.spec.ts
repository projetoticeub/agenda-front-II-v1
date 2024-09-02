/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConsultasService } from './consultas.service';

describe('Service: Consultas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultasService]
    });
  });

  it('should ...', inject([ConsultasService], (service: ConsultasService) => {
    expect(service).toBeTruthy();
  }));
});
