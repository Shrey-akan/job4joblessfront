import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquirydetailsComponent } from './enquirydetails.component';

describe('EnquirydetailsComponent', () => {
  let component: EnquirydetailsComponent;
  let fixture: ComponentFixture<EnquirydetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnquirydetailsComponent]
    });
    fixture = TestBed.createComponent(EnquirydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
