import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedjobComponent } from './savedjob.component';

describe('SavedjobComponent', () => {
  let component: SavedjobComponent;
  let fixture: ComponentFixture<SavedjobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedjobComponent]
    });
    fixture = TestBed.createComponent(SavedjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
