import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('authToken'));

  isLoggedIn$ = this.loggedIn.asObservable(); // Observable for components to subscribe to

  constructor() {}

  login(token: string) {
    localStorage.setItem('authToken', token);
    this.loggedIn.next(true); // Update login status
  }

  logout() {
    localStorage.removeItem('authToken');
    this.loggedIn.next(false); // Update login status
  }

  checkLoginStatus(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
