import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvercomingComponent } from './overcoming.component';

describe('OvercomingComponent', () => {
  let component: OvercomingComponent;
  let fixture: ComponentFixture<OvercomingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OvercomingComponent]
    });
    fixture = TestBed.createComponent(OvercomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
