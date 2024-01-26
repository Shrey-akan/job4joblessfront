import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetQuestionComponent } from './set-question.component';

describe('SetQuestionComponent', () => {
  let component: SetQuestionComponent;
  let fixture: ComponentFixture<SetQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetQuestionComponent]
    });
    fixture = TestBed.createComponent(SetQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
