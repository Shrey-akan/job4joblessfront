import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindjobuComponent } from './findjobu.component';

describe('FindjobuComponent', () => {
  let component: FindjobuComponent;
  let fixture: ComponentFixture<FindjobuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindjobuComponent]
    });
    fixture = TestBed.createComponent(FindjobuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
