import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordemployerComponent } from './resetpasswordemployer.component';

describe('ResetpasswordemployerComponent', () => {
  let component: ResetpasswordemployerComponent;
  let fixture: ComponentFixture<ResetpasswordemployerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetpasswordemployerComponent]
    });
    fixture = TestBed.createComponent(ResetpasswordemployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
