import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SignUpGuard } from './signup.guard';
import { AuthService } from '../auth-service.service';

describe('SignupGuard', () => {
  let guard: SignUpGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SignUpGuard,
        { provide: AuthService, useValue: {} },
        { provide: Router, useValue: {} }
      ]
    });

    guard = TestBed.inject(SignUpGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
