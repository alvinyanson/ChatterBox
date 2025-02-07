/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmsComponent } from './dms.component';

describe('DmsComponent', () => {
  let component: DmsComponent;
  let fixture: ComponentFixture<DmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
