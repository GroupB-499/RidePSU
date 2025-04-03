import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { baseUrl } from 'src/app/configs';
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
  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${baseUrl}/api/delete-user/${userId}`).subscribe({
        next: () => {
          // Update the passengers list after deletion
          this.schedulesList = this.schedulesList.filter((user: any) => user.id !== userId);
          this.schedules = this.schedulesList.slice(this.pageIndex, this.schedulesPerPage);
          
          this.slicedProducts();
          // Show success message
          this.toast.show('User deleted successfully!', ToastType.SUCCESS);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.toast.show('Failed to delete user!', ToastType.ERROR);
        },
      });
    }
  }

  upCard(card:any){
    // this.router.navigate(['editCard'],{queryParams:card});
  }
}
