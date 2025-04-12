import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { baseUrl } from '../configs';
import { ToastService, ToastType } from '../toast.service';
import { ConfirmService } from '../confirm.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent {
  bookings: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService,private toast: ToastService,  private confirmService: ConfirmService ) {}

  ngOnInit(): void {
    this.getBookings();
   
  }

  // Fetch bookings from the API
  getBookings(): void {
    const userId = this.authService.getUserInfo().userId;
    this.http.get<{ bookings: any[] }>(`${baseUrl}/api/get-bookings/${userId}`,{headers: new HttpHeaders({
                          'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
                        })})
      .subscribe(response => {
        this.bookings = response.bookings;
        console.log(this.bookings.map(e=>{return e;}));
      });
  }

  // Cancel booking (stub)
  async cancelBooking(bookingId: string): Promise<void> {
    const confirmed = await this.confirmService.confirm('Delete Booking', 'Are you sure you want to delete this booking?');
    if (confirmed) {
      this.http.delete(`${baseUrl}/api/delete-booking?bookingId=${bookingId}`)
        .subscribe({
          next: () => {
            this.toast.show('Booking cancelled successfully', ToastType.SUCCESS);
            this.bookings = [];
            this.getBookings();
          },
          error: (error) => {
            console.error('Error cancelling booking:', error);
            this.toast.show('Error cancelling booking', ToastType.ERROR);
          }
        });
    }
  }
}
