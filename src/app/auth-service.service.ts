import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('authToken'));
  private userInfo: any = null; // Store user info
  isLoggedIn$ = this.loggedIn.asObservable(); // Observable for components to subscribe to

  constructor() { }

  // Save user info (e.g., after login)
  setUserInfo(user: any) {
    this.userInfo = user;
    localStorage.setItem('userInfo', JSON.stringify(user)); // Persist across sessions
  }

  // Get user info
  getUserInfo() {
    if (!this.userInfo) {
      const storedUser = localStorage.getItem('userInfo');
      this.userInfo = storedUser ? JSON.parse(storedUser) : null;
    }
    return this.userInfo;
  }


  login(response: any, token:string) {
    this.setUserInfo(response);
    if(token !== '' || token !== null){

      localStorage.setItem('authToken', token);
      this.loggedIn.next(true); // Update login status
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    this.loggedIn.next(false); // Update login status
  }

  checkLoginStatus(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
