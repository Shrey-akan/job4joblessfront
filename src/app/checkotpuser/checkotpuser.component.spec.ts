import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckotpuserComponent } from './checkotpuser.component';

describe('CheckotpuserComponent', () => {
  let component: CheckotpuserComponent;
  let fixture: ComponentFixture<CheckotpuserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckotpuserComponent]
    });
    fixture = TestBed.createComponent(CheckotpuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
