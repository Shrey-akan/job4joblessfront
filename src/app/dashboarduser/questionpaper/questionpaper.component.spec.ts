import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionpaperComponent } from './questionpaper.component';

describe('QuestionpaperComponent', () => {
  let component: QuestionpaperComponent;
  let fixture: ComponentFixture<QuestionpaperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionpaperComponent]
    });
    fixture = TestBed.createComponent(QuestionpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
