import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.loggedIn.value;
    const isAdmin = this.authService.isAdmin.value;
    const isPassenger = this.authService.isPassenger.value;


    if (isLoggedIn && !isAdmin) {
      this.router.navigate(['/home']); // or wherever you want to redirect
      return false;
    }
    return true;
  }
}
