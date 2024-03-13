import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubadmindetailsComponent } from './subadmindetails.component';

describe('SubadmindetailsComponent', () => {
  let component: SubadmindetailsComponent;
  let fixture: ComponentFixture<SubadmindetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubadmindetailsComponent]
    });
    fixture = TestBed.createComponent(SubadmindetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
