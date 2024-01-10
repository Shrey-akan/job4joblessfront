import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchfiltersComponent } from './searchfilters.component';

describe('SearchfiltersComponent', () => {
  let component: SearchfiltersComponent;
  let fixture: ComponentFixture<SearchfiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchfiltersComponent]
    });
    fixture = TestBed.createComponent(SearchfiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
