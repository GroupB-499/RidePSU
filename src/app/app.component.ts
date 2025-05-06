import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth-service.service';
import { MessagingService } from './messaging.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  isLoggedIn = false;
  isPassenger = false;
  isAdmin = false;

  constructor(private router: Router, private authService: AuthService, private messagingService: MessagingService) { }

  ngOnInit() {

    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    // Subscribe to authentication state
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.authService.isPassenger$.subscribe((status) => {
      this.isPassenger = status;
    });
    this.authService.isAdmin$.subscribe((status) => {
      this.isAdmin = status;
    });

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Latitude:', position.coords.latitude);
          console.log('Longitude:', position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          if (error.code === error.PERMISSION_DENIED) {
            alert('Location permission denied. Please enable it to continue.');
          }
        }
      );

    }

  }

  menuOpen = false;
  showDropdown = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
