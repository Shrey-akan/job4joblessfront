import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpexpiredComponent } from './otpexpired.component';

describe('OtpexpiredComponent', () => {
  let component: OtpexpiredComponent;
  let fixture: ComponentFixture<OtpexpiredComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtpexpiredComponent]
    });
    fixture = TestBed.createComponent(OtpexpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
