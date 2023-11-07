import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplieduserdetailsComponent } from './applieduserdetails.component';

describe('ApplieduserdetailsComponent', () => {
  let component: ApplieduserdetailsComponent;
  let fixture: ComponentFixture<ApplieduserdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplieduserdetailsComponent]
    });
    fixture = TestBed.createComponent(ApplieduserdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
