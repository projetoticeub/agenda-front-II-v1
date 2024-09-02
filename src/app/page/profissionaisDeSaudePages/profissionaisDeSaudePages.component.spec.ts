/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProfissionaisDeSaudePagesComponent } from './profissionaisDeSaudePages.component';

describe('ProfissionaisDeSaudePagesComponent', () => {
  let component: ProfissionaisDeSaudePagesComponent;
  let fixture: ComponentFixture<ProfissionaisDeSaudePagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfissionaisDeSaudePagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionaisDeSaudePagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
