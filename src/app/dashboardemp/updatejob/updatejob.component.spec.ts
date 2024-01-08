import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatejobComponent } from './updatejob.component';

describe('UpdatejobComponent', () => {
  let component: UpdatejobComponent;
  let fixture: ComponentFixture<UpdatejobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatejobComponent]
    });
    fixture = TestBed.createComponent(UpdatejobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
