import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeinfoformComponent } from './geinfoform.component';

describe('GeinfoformComponent', () => {
  let component: GeinfoformComponent;
  let fixture: ComponentFixture<GeinfoformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeinfoformComponent]
    });
    fixture = TestBed.createComponent(GeinfoformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
