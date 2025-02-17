import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDashComponent } from './driver-dash.component';

describe('DriverDashComponent', () => {
  let component: DriverDashComponent;
  let fixture: ComponentFixture<DriverDashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverDashComponent]
    });
    fixture = TestBed.createComponent(DriverDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
