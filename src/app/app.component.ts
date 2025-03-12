import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth-service.service';
import { MessagingService } from './messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit {
  isLoggedIn = false;
  isPassenger = false;

  constructor(private router: Router,private authService: AuthService, private messagingService: MessagingService) {}

  ngOnInit() {

    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    // Subscribe to authentication state
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.authService.isPassenger$.subscribe((status)=>{
      this.isPassenger = status;
    });


  }

  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  
  logout() {
    this.authService.logout();
  this.router.navigate(['/login']);
  }

}
