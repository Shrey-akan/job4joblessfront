import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindcvComponent } from './findcv.component';

describe('FindcvComponent', () => {
  let component: FindcvComponent;
  let fixture: ComponentFixture<FindcvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindcvComponent]
    });
    fixture = TestBed.createComponent(FindcvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
