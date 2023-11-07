import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettinguserComponent } from './settinguser.component';

describe('SettinguserComponent', () => {
  let component: SettinguserComponent;
  let fixture: ComponentFixture<SettinguserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettinguserComponent]
    });
    fixture = TestBed.createComponent(SettinguserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
