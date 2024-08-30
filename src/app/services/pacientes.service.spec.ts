/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PacientesService } from './pacientes.service';

describe('Service: Pacientes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PacientesService]
    });
  });

  it('should ...', inject([PacientesService], (service: PacientesService) => {
    expect(service).toBeTruthy();
  }));
});
