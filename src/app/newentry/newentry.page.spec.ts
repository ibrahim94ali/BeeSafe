import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewentryPage } from './newentry.page';

describe('NewentryPage', () => {
  let component: NewentryPage;
  let fixture: ComponentFixture<NewentryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewentryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewentryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
