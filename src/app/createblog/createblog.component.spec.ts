import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateblogComponent } from './createblog.component';

describe('CreateblogComponent', () => {
  let component: CreateblogComponent;
  let fixture: ComponentFixture<CreateblogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateblogComponent]
    });
    fixture = TestBed.createComponent(CreateblogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
