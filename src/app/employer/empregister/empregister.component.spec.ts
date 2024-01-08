import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpregisterComponent } from './empregister.component';

describe('EmpregisterComponent', () => {
  let component: EmpregisterComponent;
  let fixture: ComponentFixture<EmpregisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpregisterComponent]
    });
    fixture = TestBed.createComponent(EmpregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
