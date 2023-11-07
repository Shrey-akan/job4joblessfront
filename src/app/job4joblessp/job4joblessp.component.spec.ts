import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Job4joblesspComponent } from './job4joblessp.component';

describe('Job4joblesspComponent', () => {
  let component: Job4joblesspComponent;
  let fixture: ComponentFixture<Job4joblesspComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Job4joblesspComponent]
    });
    fixture = TestBed.createComponent(Job4joblesspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
