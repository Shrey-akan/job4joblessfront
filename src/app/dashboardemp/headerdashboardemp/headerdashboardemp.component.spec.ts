import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderdashboardempComponent } from './headerdashboardemp.component';

describe('HeaderdashboardempComponent', () => {
  let component: HeaderdashboardempComponent;
  let fixture: ComponentFixture<HeaderdashboardempComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderdashboardempComponent]
    });
    fixture = TestBed.createComponent(HeaderdashboardempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
