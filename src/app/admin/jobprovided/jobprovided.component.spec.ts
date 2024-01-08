import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobprovidedComponent } from './jobprovided.component';

describe('JobprovidedComponent', () => {
  let component: JobprovidedComponent;
  let fixture: ComponentFixture<JobprovidedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobprovidedComponent]
    });
    fixture = TestBed.createComponent(JobprovidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
