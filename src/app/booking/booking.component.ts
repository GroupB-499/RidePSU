import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';

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

  departureLocations = [
    { value: 'PSU', label: 'Prince Sultan University' },
    { value: 'King Salman Park Metro Station', label: 'King Salman Park Metro Station' },
    { value: 'Ministry of Education Metro Station', label: 'Ministry of Education Metro Station' }
];

destinationOptions: { [key: string]: { value: string, label: string }[] } = {
    'PSU': [
        { value: 'King Salman Park Metro Station', label: 'King Salman Park Metro Station' },
        { value: 'Ministry of Education Metro Station', label: 'Ministry of Education Metro Station' }
    ],
    'King Salman Park Metro Station': [
        { value: 'PSU', label: 'Prince Sultan University' }
    ],
    'Ministry of Education Metro Station': [
        { value: 'PSU', label: 'Prince Sultan University' }
    ]
};

filteredDestinations: { value: string, label: string }[] = [];


  constructor(private fb: FormBuilder,private http: HttpClient, private authService: AuthService, private cdRef: ChangeDetectorRef) {
      this.tripForm = this.fb.group({
          departure: ['', Validators.required],
          destination: ['', Validators.required],
          transportType: ['shuttlebus', Validators.required],
          date: ['', Validators.required],
          time: ['', Validators.required]
      });
  }
  private apiUrl = 'http://localhost:3000/api/create-booking'; 


  updateTransportType(): void {
    const departure = this.tripForm.get('departure')?.value;
    const destination = this.tripForm.get('destination')?.value;
    console.log(departure, destination);

    if ((departure === 'PSU' && destination === 'Ministry of Education Metro Station') || 
        (departure === 'Ministry of Education Metro Station' && destination === 'PSU')) {
        this.tripForm.get('transportType')?.setValue('golf car', { emitEvent: false });
    } else {
        this.tripForm.get('transportType')?.setValue('shuttle bus', { emitEvent: false });
    }
}
  ngOnInit(): void {
    console.log(typeof this.tripForm.get('departure')?.value);
      this.generateTimeSlots();
      this.tripForm.get('departure')?.valueChanges.subscribe((departure) => {
        this.resetAndUpdateDestinations(departure);
    });

    this.tripForm.get('destination')?.valueChanges.subscribe(() => {
      this.updateTransportType();
  });
  }
  resetAndUpdateDestinations(departure: string): void {
    this.tripForm.get('destination')?.setValue('', { emitEvent: false });
    this.cdRef.detectChanges();
    if (departure) {
        
        this.filteredDestinations = this.destinationOptions[departure] || [];
        this.tripForm.get('destination')?.enable(); // Enable destination dropdown
    } else {
        this.filteredDestinations = [];
        this.tripForm.get('destination')?.disable(); // Disable if no departure selected
    }

    this.updateTransportType();
    
}

checkBookingAvailability(): void {
    const selectedDate = this.tripForm.get('date')?.value;
    const selectedTime = this.tripForm.get('time')?.value;

    if (!selectedDate || !selectedTime) {
        alert('Please select both date and time first.');
        return;
    }

    const url = `http://localhost:3000/api/booking-count?date=${selectedDate}&time=${selectedTime}`;

    this.http.get<{ count: number }>(url).subscribe(
        (response) => {
            this.bookingCount = response.count;
        },
        (error) => {
            console.error('Error fetching booking count:', error);
            alert('Failed to check availability.');
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
    if (this.tripForm.valid) {
        const userId = this.authService.getUserInfo().userId;
        const formData = { ...this.tripForm.value, userId };

        this.http.post(this.apiUrl, formData).subscribe(
            response => {
                alert('Booking successful!');
                this.tripForm.reset();
            },
            error => {
                console.error('Error:', error);
                alert('Failed to create booking.');
            }
        );
    }
}
}
