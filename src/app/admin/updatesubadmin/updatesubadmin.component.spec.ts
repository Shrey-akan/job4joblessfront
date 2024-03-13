import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatesubadminComponent } from './updatesubadmin.component';

describe('UpdatesubadminComponent', () => {
  let component: UpdatesubadminComponent;
  let fixture: ComponentFixture<UpdatesubadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatesubadminComponent]
    });
    fixture = TestBed.createComponent(UpdatesubadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
