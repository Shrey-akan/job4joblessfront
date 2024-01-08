import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpsignComponent } from './empsign.component';

describe('EmpsignComponent', () => {
  let component: EmpsignComponent;
  let fixture: ComponentFixture<EmpsignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpsignComponent]
    });
    fixture = TestBed.createComponent(EmpsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
