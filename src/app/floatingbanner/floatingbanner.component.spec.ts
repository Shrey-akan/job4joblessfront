import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingbannerComponent } from './floatingbanner.component';

describe('FloatingbannerComponent', () => {
  let component: FloatingbannerComponent;
  let fixture: ComponentFixture<FloatingbannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloatingbannerComponent]
    });
    fixture = TestBed.createComponent(FloatingbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
