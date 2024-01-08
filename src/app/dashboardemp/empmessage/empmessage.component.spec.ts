import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpmessageComponent } from './empmessage.component';

describe('EmpmessageComponent', () => {
  let component: EmpmessageComponent;
  let fixture: ComponentFixture<EmpmessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpmessageComponent]
    });
    fixture = TestBed.createComponent(EmpmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
