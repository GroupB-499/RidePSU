import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('authToken'));
  public isPassenger = new BehaviorSubject<boolean>(
    (() => {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo).role === 'user' : false;
    })()
  );
  public isAdmin = new BehaviorSubject<boolean>(
    (() => {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo).role === 'admin' : false;
    })()
  );


  private userInfo: any = null; // Store user info
  isLoggedIn$ = this.loggedIn.asObservable(); // Observable for components to subscribe to
  isPassenger$ = this.isPassenger.asObservable(); // Observable for components to subscribe to
  isAdmin$ = this.isAdmin.asObservable(); // Observable for components to subscribe to

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


  login(response: any, token: string) {

    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');

    this.setUserInfo(response);
    if (token !== '' || token !== null) {

      localStorage.setItem('authToken', token);
      this.loggedIn.next(true); // Update login status
      this.isPassenger.next(response.role == 'user' ? true : false); // Update passenger status
      this.isAdmin.next(response.role == 'admin' ? true : false); // Update passenger status
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    this.loggedIn.next(false); // Update login status
  }

  checkLoginStatus(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
