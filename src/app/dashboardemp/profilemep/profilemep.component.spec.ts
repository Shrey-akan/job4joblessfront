import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilemepComponent } from './profilemep.component';

describe('ProfilemepComponent', () => {
  let component: ProfilemepComponent;
  let fixture: ComponentFixture<ProfilemepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilemepComponent]
    });
    fixture = TestBed.createComponent(ProfilemepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
