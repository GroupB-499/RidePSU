import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PassengerGuard } from './passenger.guard';
import { AuthService } from '../auth-service.service';

describe('PassengerGuard', () => {
  let guard: PassengerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PassengerGuard,
        { provide: AuthService, useValue: {} },
        { provide: Router, useValue: {} }
      ]
    });

    guard = TestBed.inject(PassengerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
