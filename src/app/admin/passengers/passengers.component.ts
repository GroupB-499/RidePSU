import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { baseUrl } from 'src/app/configs';
import { ToastService, ToastType } from 'src/app/toast.service';

@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.css']
})
export class PassengersComponent {

  passengersList: any= [];
  passengers:any = [];
  passengersPerPage: number = 10;
  public selectedPage= 1;
  public pageIndex = 0;
  searchText: any;

  constructor(private http: HttpClient,
    private toast: ToastService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllPassengers();
    this.pageIndex = (this.selectedPage - 1)*this.passengersPerPage;
  }
  
  getAllPassengers() {
    this.passengersList = [];

    this.http.get<any>(`${baseUrl}/api/getUsers`, {
                headers: new HttpHeaders({
                  'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
                })}).subscribe({
          next: (data) => {
            this.passengersList = data.users;
            this.passengers = this.passengersList.slice(this.pageIndex, this.passengersPerPage);
            
          },
          error: (error) => {
            console.error('Error fetching passengers:', error);
            this.toast.show('Failed to load passengers. Please try again later.', ToastType.ERROR);
          }
        });
  }
  get pageNumbers(): number[]{
    return Array(Math.ceil(this.passengersList.length / this.passengersPerPage))
    .fill(0).map((x,i)=>i+1);
  }
  changePage(page:any){
    this.selectedPage = page;
    this.slicedProducts();
  }
  slicedProducts(){
    this.pageIndex = (this.selectedPage - 1)*this.passengersPerPage;
    let endIndex = (this.selectedPage - 1)*this.passengersPerPage + this.passengersPerPage;
    this.passengers = [];
    this.passengers = this.passengersList.slice(this.pageIndex, endIndex);
  }
  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${baseUrl}/api/delete-user/${userId}`).subscribe({
        next: () => {
          // Update the passengers list after deletion
          this.passengersList = this.passengersList.filter((user: any) => user.id !== userId);
          this.passengers = this.passengersList.slice(this.pageIndex, this.passengersPerPage);
          
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

  // @HostListener('document:click', ['$event'])
  // clickout(event:any) {
  //   if(event.target.id == 'cardEditButton'){
  //     var element = event.target;
      
  //     var index = element.getAttribute("data-index");
  //     this.upCard(this.cards[index]);
  //   }
  //   if(event.target.id == 'cardDeleteButton'){
  //     var element = event.target;
      
  //     var index = element.getAttribute("data-index");
  //     this.delCard(this.cards[index]);
  //   }
  // }
}

