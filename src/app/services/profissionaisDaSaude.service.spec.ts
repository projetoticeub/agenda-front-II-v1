/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProfissionaisDaSaudeService } from './profissionaisDaSaude.service';

describe('Service: ProfissionaisDaSaude', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfissionaisDaSaudeService]
    });
  });

  it('should ...', inject([ProfissionaisDaSaudeService], (service: ProfissionaisDaSaudeService) => {
    expect(service).toBeTruthy();
  }));
});
