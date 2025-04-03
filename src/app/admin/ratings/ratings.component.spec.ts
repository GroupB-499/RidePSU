import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRatingsComponent } from './ratings.component';

describe('RatingsComponent', () => {
  let component: AdminRatingsComponent;
  let fixture: ComponentFixture<AdminRatingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRatingsComponent]
    });
    fixture = TestBed.createComponent(AdminRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
