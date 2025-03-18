import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { baseUrl } from '../configs';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  private apiUrl = `${baseUrl}/api/get-notifications`;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.fetchNotifications();
  }

  

  getFormattedDate(timestamp: any): string {
    if (timestamp && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleString(); // Convert to human-readable date
    }
    return 'Invalid Date';
  }
  

  fetchNotifications() {
    const userId = this.authService.getUserInfo().userId;

    this.http.get(`${this.apiUrl}/${userId}`,{headers: new HttpHeaders({
                          'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
                        })}).subscribe({
      next: (response: any) => {
        console.log(response);
        this.notifications = response.notifications;
      },
      error: (error) => {
        console.error('Error fetching notifications:', error);
      }
    });
  }
}
