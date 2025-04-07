import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Injectable({ providedIn: 'root' })
export class PassengerGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.loggedIn && !this.auth.isAdmin.value) {
      return true;
    }
    if(!this.auth.loggedIn){
      this.router.navigate(['/login']);
      return false;
    }
    this.router.navigate(['/passenger']);
    return false;
  }
}
