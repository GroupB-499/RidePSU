import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


interface Schedule {
  id: string;
  time: string;
  pickupLocations: string[];
  dropoffLocations: string[];
  transportType: string;
}

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  schedules: Schedule[] = [];

  groupedSchedules: { time: string; schedules: Schedule[] }[] = [];
  apiUrl = 'http://localhost:3000/api/get-schedules'; // API endpoint

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchSchedules();
  }

  fetchSchedules() {
    this.http.get<Schedule[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.schedules = data;
        this.schedules.sort((a, b) => this.convertToMinutes(a.time) - this.convertToMinutes(b.time));
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

  isLast(list: string[], item: string): boolean {
    return list.indexOf(item) === list.length - 1;
  }
}
