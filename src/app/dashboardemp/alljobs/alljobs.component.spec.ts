import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlljobsComponent } from './alljobs.component';

describe('AlljobsComponent', () => {
  let component: AlljobsComponent;
  let fixture: ComponentFixture<AlljobsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlljobsComponent]
    });
    fixture = TestBed.createComponent(AlljobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
