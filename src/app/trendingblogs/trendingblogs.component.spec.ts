import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingblogsComponent } from './trendingblogs.component';

describe('TrendingblogsComponent', () => {
  let component: TrendingblogsComponent;
  let fixture: ComponentFixture<TrendingblogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrendingblogsComponent]
    });
    fixture = TestBed.createComponent(TrendingblogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
