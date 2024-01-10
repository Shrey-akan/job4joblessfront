import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoresearchComponent } from './coresearch.component';

describe('CoresearchComponent', () => {
  let component: CoresearchComponent;
  let fixture: ComponentFixture<CoresearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoresearchComponent]
    });
    fixture = TestBed.createComponent(CoresearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
