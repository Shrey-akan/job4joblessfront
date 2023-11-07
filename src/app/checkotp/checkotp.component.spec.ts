import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckotpComponent } from './checkotp.component';

describe('CheckotpComponent', () => {
  let component: CheckotpComponent;
  let fixture: ComponentFixture<CheckotpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckotpComponent]
    });
    fixture = TestBed.createComponent(CheckotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
