import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinjobpageComponent } from './finjobpage.component';

describe('FinjobpageComponent', () => {
  let component: FinjobpageComponent;
  let fixture: ComponentFixture<FinjobpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinjobpageComponent]
    });
    fixture = TestBed.createComponent(FinjobpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
