import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationempComponent } from './notificationemp.component';

describe('NotificationempComponent', () => {
  let component: NotificationempComponent;
  let fixture: ComponentFixture<NotificationempComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationempComponent]
    });
    fixture = TestBed.createComponent(NotificationempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
