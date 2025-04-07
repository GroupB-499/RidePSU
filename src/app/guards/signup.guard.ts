import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class SignUpGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.loggedIn.value;
    const isAdmin = this.authService.isAdmin.value;
    const isPassenger = this.authService.isPassenger.value;
    const isDriver = !this.authService.isPassenger.value;

    if (isLoggedIn && isPassenger) {
      this.router.navigate(['/home']); // or wherever you want to redirect
      return false;
    }
    if (isLoggedIn && isAdmin) {
      
      return true;
    }
    if (isLoggedIn && isDriver) {
      this.router.navigate(['/driverDash']); // or wherever you want to redirect
      return false;
    }



    return true; // allow access to login/signup
  }
}
