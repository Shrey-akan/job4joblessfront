import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisapprovejobComponent } from './disapprovejob.component';

describe('DisapprovejobComponent', () => {
  let component: DisapprovejobComponent;
  let fixture: ComponentFixture<DisapprovejobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisapprovejobComponent]
    });
    fixture = TestBed.createComponent(DisapprovejobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
