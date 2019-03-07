import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditentryPage } from './editentry.page';

describe('EditentryPage', () => {
  let component: EditentryPage;
  let fixture: ComponentFixture<EditentryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditentryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditentryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
