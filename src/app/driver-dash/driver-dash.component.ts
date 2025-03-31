import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { baseUrl } from '../configs';
import { ToastService, ToastType } from '../toast.service';

interface Schedule {
  id: string;
  time: string;
  pickupLocations: string[];
  dropoffLocations: string[];
  transportType: string;
}

@Component({
  selector: 'app-driver-dash',
  templateUrl: './driver-dash.component.html',
  styleUrls: ['./driver-dash.component.css']
})
export class DriverDashComponent {
schedules: Schedule[] = [];
apiUrl = '';
  groupedSchedules: { time: string; schedules: Schedule[] }[] = [];
   // API endpoint

  constructor(private http: HttpClient, private authService:AuthService,private toast: ToastService) {}

  ngOnInit() {
    const userId = this.authService.getUserInfo().userId;
    this.apiUrl = `${baseUrl}/api/get-driver-schedules?driverId=${userId}`;
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
    this.groupSchedulesByTime();

      },
      error: (error) => {
        console.error('Error fetching schedules:', error);
        this.toast.show('Failed to load schedules. Please try again later.', ToastType.ERROR);
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
