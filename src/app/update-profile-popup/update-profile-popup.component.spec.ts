import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfilePopupComponent } from './update-profile-popup.component';

describe('UpdateProfilePopupComponent', () => {
  let component: UpdateProfilePopupComponent;
  let fixture: ComponentFixture<UpdateProfilePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateProfilePopupComponent]
    });
    fixture = TestBed.createComponent(UpdateProfilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
