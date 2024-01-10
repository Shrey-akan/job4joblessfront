import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcarduComponent } from './jobcardu.component';

describe('JobcarduComponent', () => {
  let component: JobcarduComponent;
  let fixture: ComponentFixture<JobcarduComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobcarduComponent]
    });
    fixture = TestBed.createComponent(JobcarduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
