import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { baseUrl } from '../configs';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  tripForm: FormGroup;
  availableTimes: string[] = [];
  minDate: string = new Date().toISOString().split('T')[0];
  bookingCount:any = null;

  pickupLocations = [
    { value: 'Prince Sultan University', label: 'Prince Sultan University' },
    { value: 'King Salman Park Metro Station', label: 'King Salman Park Metro Station' },
    { value: 'Ministry of Education Metro Station', label: 'Ministry of Education Metro Station' }
];

dropoffOptions: { [key: string]: { value: string, label: string }[] } = {
    'Prince Sultan University': [
        { value: 'King Salman Park Metro Station', label: 'King Salman Park Metro Station' },
        { value: 'Ministry of Education Metro Station', label: 'Ministry of Education Metro Station' }
    ],
    'King Salman Park Metro Station': [
        { value: 'Prince Sultan University', label: 'Prince Sultan University' }
    ],
    'Ministry of Education Metro Station': [
        { value: 'Prince Sultan University', label: 'Prince Sultan University' }
    ]
};

filteredDropoff: { value: string, label: string }[] = [];


  constructor(private fb: FormBuilder,private http: HttpClient, private authService: AuthService, private cdRef: ChangeDetectorRef, private toast: ToastService) {
      this.tripForm = this.fb.group({
          pickup: ['', Validators.required],
          dropoff: ['', Validators.required],
          transportType: ['', Validators.required],
          date: ['', Validators.required],
          time: ['', Validators.required]
      });
  }
  private apiUrl = `${baseUrl}/api/create-booking`;


  updateTransportType(): void {
    const pickup = this.tripForm.get('pickup')?.value;
    const dropoff = this.tripForm.get('dropoff')?.value;
    console.log(pickup, dropoff);

    if ((pickup === 'Prince Sultan University' && dropoff === 'Ministry of Education Metro Station') || 
        (pickup === 'Ministry of Education Metro Station' && dropoff === 'Prince Sultan University')) {
        this.tripForm.get('transportType')?.setValue('golf car', { emitEvent: false });
    } else {
        this.tripForm.get('transportType')?.setValue('shuttle bus', { emitEvent: false });
    }
}
  ngOnInit(): void {
    console.log(typeof this.tripForm.get('pickup')?.value);
      this.generateTimeSlots();
      this.tripForm.get('pickup')?.valueChanges.subscribe((pickup) => {
        this.resetAndUpdateDropoffs(pickup);
        this.bookingCount = null;
    });

    this.tripForm.get('dropoff')?.valueChanges.subscribe(() => {
      this.updateTransportType();
      this.bookingCount = null;
  });
  this.tripForm.get('time')?.valueChanges.subscribe(()=>{
    this.bookingCount = null;
  });
  this.tripForm.get('date')?.valueChanges.subscribe(()=>{
    this.bookingCount = null;
  });
  }
  resetAndUpdateDropoffs(pickup: string): void {
    this.tripForm.get('dropoff')?.setValue('', { emitEvent: false });
    this.cdRef.detectChanges();
    if (pickup) {
        
        this.filteredDropoff = this.dropoffOptions[pickup] || [];
        this.tripForm.get('dropoff')?.enable(); // Enable Dropoffs dropdown
    } else {
        this.filteredDropoff = [];
        this.tripForm.get('dropoff')?.disable(); // Disable if no pickup selected
    }

    this.updateTransportType();
    
}

checkBookingAvailability(): void {
    const selectedDate = this.tripForm.get('date')?.value;
    const selectedTime = this.tripForm.get('time')?.value;
    const selectedPickup = this.tripForm.get('pickup')?.value;
    const selectedDropoff = this.tripForm.get('dropoff')?.value;
    const selectedTransport = this.tripForm.get('transportType')?.value;

    if (!selectedDate || !selectedTime || !selectedTransport) {
        this.toast.show('Please select date, time and transport type first.');
        return;
    }

    const url = `${baseUrl}/api/booking-count?date=${selectedDate}&time=${selectedTime}&transportType=${selectedTransport}&pickup=${selectedPickup}&dropoff=${selectedDropoff}`;

    this.http.get<{ count: number }>(url, {
        headers: new HttpHeaders({
          'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
        })}).subscribe(
        (response) => {
            this.bookingCount = response.count;
        },
        (error) => {
            console.error('Error fetching booking count:', error);
            this.bookingCount = null;
            this.toast.show(`Error: ${error.error['error']}`);

        }
    );
}



  generateTimeSlots(): void {
      let startHour = 8;
      let startMinute = 0;
      while (startHour < 18 || (startHour === 18 && startMinute === 0)) {
          const formattedTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
          this.availableTimes.push(formattedTime);

          startMinute += 10;
          if (startMinute >= 60) {
              startMinute = 0;
              startHour++;
          }
      }
  }
  bookRide(): void {
    if(this.tripForm.invalid){
        return;
    }
    if(this.bookingCount == null || this.bookingCount >= 13){
        this.toast.show("Booking not available!");
        return;
    }
    if (this.tripForm.valid) {
        const userId = this.authService.getUserInfo().userId;
        
        const formData = { ...this.tripForm.value, userId };

        this.http.post(this.apiUrl, formData).subscribe(
            response => {
                this.toast.show('Booking successful!');
                this.tripForm.reset();
                this.bookingCount = null;
            },
            error => {
                console.error('Error:', error);
                this.bookingCount = null; 
                this.toast.show('Failed to create booking.');
            }
        );
    }
}
}
