import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyjobComponent } from './applyjob.component';

describe('ApplyjobComponent', () => {
  let component: ApplyjobComponent;
  let fixture: ComponentFixture<ApplyjobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyjobComponent]
    });
    fixture = TestBed.createComponent(ApplyjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
