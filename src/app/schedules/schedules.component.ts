import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { baseUrl } from '../configs';

interface Schedule {
  id: string;
  time: string;
  pickupLocations: string[];
  dropoffLocations: string[];
  transportType: string;
  eta?: string; // Add ETA field
}

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  schedules: Schedule[] = [];
  groupedSchedules: { time: string; schedules: Schedule[] }[] = [];
  apiUrl = `${baseUrl}/api/get-schedules`; // API endpoint

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchSchedules();
  }

  fetchSchedules() {
    this.http.get<Schedule[]>(this.apiUrl, {
                headers: new HttpHeaders({
                  'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
                })}).subscribe({
      next: (data) => {
        this.schedules = data;
        this.schedules.sort((a, b) => this.convertToMinutes(a.time) - this.convertToMinutes(b.time));
        this.schedules.forEach(schedule => {
          schedule.eta = this.calculateETA(schedule.time);
        });
        this.groupSchedulesByTime();
      },
      error: (error) => {
        console.error('Error fetching schedules:', error);
        alert('Failed to load schedules. Please try again later.');
      }
    });
  }
  

  convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(num => parseInt(num, 10));
    return hours * 60 + minutes;
  }

  calculateETA(scheduleTime: string): string {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD

    // Construct a Date object with today's date and schedule's time
    let scheduleDateTime = new Date(`${today}T${scheduleTime}:00`);

    // If the schedule time has already passed today, set it for the next day
    if (scheduleDateTime.getTime() < now.getTime()) {
      scheduleDateTime.setDate(scheduleDateTime.getDate() + 1);
    }

    const remainingMs = scheduleDateTime.getTime() - now.getTime();
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes remaining`;
  }

  groupSchedulesByTime() {
    const groupedMap = new Map<string, Schedule[]>();

    this.schedules.forEach(schedule => {
      if (!groupedMap.has(schedule.time)) {
        groupedMap.set(schedule.time, []);
      }
      groupedMap.get(schedule.time)!.push(schedule);
    });

    this.groupedSchedules = Array.from(groupedMap, ([time, schedules]) => ({
      time,
      schedules
    }));
  }
}
