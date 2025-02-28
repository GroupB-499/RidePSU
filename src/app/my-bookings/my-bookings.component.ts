import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent {
  bookings: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.getBookings();
   
  }

  // Fetch bookings from the API
  getBookings(): void {
    const userId = this.authService.getUserInfo().userId;
    this.http.get<{ bookings: any[] }>(`http://localhost:3000/api/get-bookings/${userId}`)
      .subscribe(response => {
        this.bookings = response.bookings;
        console.log(this.bookings.map(e=>{return e;}));
      });
  }

  // Cancel booking (stub)
  cancelBooking(bookingId: string): void {
    const confirmed = confirm('Are you sure you want to cancel this booking?');
    if (confirmed) {
      this.http.delete(`http://localhost:3000/api/delete-booking?bookingId=${bookingId}`)
        .subscribe({
          next: () => {
            alert('Booking cancelled successfully');
            this.bookings = [];
            this.getBookings();
          },
          error: (error) => {
            console.error('Error cancelling booking:', error);
            alert('Error cancelling booking');
          }
        });
    }
  }
}
