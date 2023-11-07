import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostjobComponent } from './postjob.component';

describe('PostjobComponent', () => {
  let component: PostjobComponent;
  let fixture: ComponentFixture<PostjobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostjobComponent]
    });
    fixture = TestBed.createComponent(PostjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
