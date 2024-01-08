import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckotpemployerComponent } from './checkotpemployer.component';

describe('CheckotpemployerComponent', () => {
  let component: CheckotpemployerComponent;
  let fixture: ComponentFixture<CheckotpemployerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckotpemployerComponent]
    });
    fixture = TestBed.createComponent(CheckotpemployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
