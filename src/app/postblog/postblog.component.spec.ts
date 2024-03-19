import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostblogComponent } from './postblog.component';

describe('PostblogComponent', () => {
  let component: PostblogComponent;
  let fixture: ComponentFixture<PostblogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostblogComponent]
    });
    fixture = TestBed.createComponent(PostblogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
