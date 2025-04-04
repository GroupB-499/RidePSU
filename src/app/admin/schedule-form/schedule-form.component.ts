import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { baseUrl } from 'src/app/configs';
import { ToastService, ToastType } from 'src/app/toast.service';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  isEditMode = false;
  schedule: any = {
    pickupLocations: '',
    dropoffLocations: '',
    time: '',
    transportType: '',
    id: null
  };

  minDate: string = new Date().toISOString().split('T')[0];
  availableTimes: string[] = [];

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.generateTimeSlots();

    // Get query params and prefill if editing
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;

        this.schedule = {
          id: params['id'],
          pickupLocations: params['pickup'],
          dropoffLocations: params['dropoff'],
          time: params['time'],
          transportType: params['transportType']
        };

        // Update dropoff options when prefilling
        this.filteredDropoff = this.dropoffOptions[this.schedule.pickupLocations] || [];
      }
    });
  }

  onPickupChange(): void {
    const pickup = this.schedule.pickupLocations;
    this.schedule.dropoffLocations = '';
    this.filteredDropoff = this.dropoffOptions[pickup] || [];
    this.updateTransportType();
  }

  onDropoffChange(): void {
    this.updateTransportType();
  }

  updateTransportType(): void {
    const pickup = this.schedule.pickupLocations;
    const dropoff = this.schedule.dropoffLocations;

    if (
      (pickup === 'Prince Sultan University' && dropoff === 'Ministry of Education Metro Station') ||
      (pickup === 'Ministry of Education Metro Station' && dropoff === 'Prince Sultan University')
    ) {
      this.schedule.transportType = 'golf car';
    } else if (pickup && dropoff) {
      this.schedule.transportType = 'shuttle bus';
    } else {
      this.schedule.transportType = '';
    }
  }

  generateTimeSlots(): void {
    let startHour = 8;
    let startMinute = 0;
    while (startHour < 18 || (startHour === 18 && startMinute === 0)) {
      const formattedTime = `${startHour.toString().padStart(2, '0')}:${startMinute
        .toString()
        .padStart(2, '0')}`;
      this.availableTimes.push(formattedTime);
      startMinute += 10;
      if (startMinute >= 60) {
        startMinute = 0;
        startHour++;
      }
    }
  }

  saveSchedule() {
    if (!this.schedule.time || !this.schedule.pickupLocations || !this.schedule.dropoffLocations || !this.schedule.transportType) {
      this.toast.show("All fields are required.", ToastType.ERROR);
      return;
    }

    const scheduleData = {
      time: this.schedule.time,
      pickupLocations: this.schedule.pickupLocations,
      dropoffLocations: this.schedule.dropoffLocations,
      transportType: this.schedule.transportType
    };

    if (this.isEditMode && this.schedule.id) {
      this.http.put(`${baseUrl}/api/update-schedule/${this.schedule.id}`, scheduleData).subscribe({
        next: () => {
          this.toast.show("Schedule updated successfully.", ToastType.SUCCESS);
          this.router.navigate(['/admin-schedules']);
        },
        error: (err) => {
          this.toast.show(err.error?.error || "Failed to update schedule.", ToastType.ERROR);
        }
      });
    } else {
      this.http.post(`${baseUrl}/api/add-schedule`, scheduleData).subscribe({
        next: () => {
          this.toast.show("Schedule added successfully.", ToastType.SUCCESS);
          this.router.navigate(['/admin-schedules']);
        },
        error: (err) => {
          this.toast.show(err.error?.error || "Failed to add schedule.", ToastType.ERROR);
        }
      });
    }
  }
}
