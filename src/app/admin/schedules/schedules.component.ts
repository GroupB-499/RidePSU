import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { baseUrl } from 'src/app/configs';
import { ConfirmService } from 'src/app/confirm.service';
import { ToastService, ToastType } from 'src/app/toast.service';
@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class AdminSchedulesComponent {
schedulesList: any= [];
  schedules:any = [];
  schedulesPerPage: number = 10;
  public selectedPage= 1;
  public pageIndex = 0;
  searchText: any;

  constructor(private http: HttpClient,
    private toast: ToastService,
    private confirmService: ConfirmService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllSchedules();
    this.pageIndex = (this.selectedPage - 1)*this.schedulesPerPage;
  }
  
  getAllSchedules() {
    this.schedulesList = [];
    this.http.get<any>(`${baseUrl}/api/get-schedules`, {
                headers: new HttpHeaders({
                  'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
                })}).subscribe({
          next: (data) => {
            this.schedulesList = data;
            this.schedulesList.sort((a: { time: string; }, b: { time: string; }) => this.convertToMinutes(a.time) - this.convertToMinutes(b.time));

            this.schedules = this.schedulesList.slice(this.pageIndex, this.schedulesPerPage);
            
          },
          error: (error) => {
            console.error('Error fetching passengers:', error);
            this.toast.show('Failed to load passengers. Please try again later.', ToastType.ERROR);
          }
        });
  }


  convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(num => parseInt(num, 10));
    return hours * 60 + minutes;
  }
  get pageNumbers(): number[]{
    return Array(Math.ceil(this.schedulesList.length / this.schedulesPerPage))
    .fill(0).map((x,i)=>i+1);
  }
  changePage(page:any){
    this.selectedPage = page;
    this.slicedProducts();
  }
  slicedProducts(){
    this.pageIndex = (this.selectedPage - 1)*this.schedulesPerPage;
    let endIndex = (this.selectedPage - 1)*this.schedulesPerPage + this.schedulesPerPage;
    this.schedules = [];
    this.schedules = this.schedulesList.slice(this.pageIndex, endIndex);
  }
  async deleteSchedule(scheduleId: string) {
    if (await this.confirmService.confirm('Delete User', 'Are you sure you want to delete this user?')) {
      this.http.delete(`${baseUrl}/api/delete-schedule/${scheduleId}`).subscribe({
        next: () => {
          this.schedulesList = this.schedulesList.filter((schedule:  any) => schedule.id !== scheduleId);
          this.slicedProducts();
          this.toast.show('Schedule deleted successfully!', ToastType.SUCCESS);
        },
        error: (error) => {
          console.error('Error deleting schedule:', error);
          this.toast.show('Failed to delete schedule.', ToastType.ERROR);
        }
      });
    }
  }
  

  upCard(card:any){
    // this.router.navigate(['editCard'],{queryParams:card});
  }
}
