import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignDriverModalComponent } from 'src/app/assign-driver-modal/assign-driver-modal.component';
import { baseUrl } from 'src/app/configs';
import { ConfirmService } from 'src/app/confirm.service';
import { ToastService, ToastType } from 'src/app/toast.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent {

  driversList: any= [];
  drivers:any = [];
  driversPerPage: number = 10;
  public selectedPage= 1;
  public pageIndex = 0;
  searchText: any;
  

  constructor(private http: HttpClient,
    private toast: ToastService,
    private modalService: NgbModal,
    private confirmService: ConfirmService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllDrivers();
    this.pageIndex = (this.selectedPage - 1)*this.driversPerPage;
  }

  openTimeModal(driverId: string) {
    const modalRef = this.modalService.open(AssignDriverModalComponent, { centered: true });
    modalRef.result.then(
      result => {
        console.log('Modal data:', result); // { from: "08:00", to: "08:30", transport: "Shuttle Bus" }
        const data = {
          driverId: driverId,
          startTimeFrom: result.from,
          startTimeTo: result.to,
          transportType: result.transport
        };
        this.http.post(`${baseUrl}/api/add-driver`, data, {
          headers: new HttpHeaders({
            'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
          })
        }).subscribe({
          next: (response) => {
            console.log('Driver assigned successfully:', response);
            this.toast.show('Driver assigned successfully!', ToastType.SUCCESS);
          },
          error: (error) => {
            console.error('Error assigning driver:', error);
            this.toast.show('Failed to assign driver. Please try again later.', ToastType.ERROR);
          }
        });
      },
      reason => {
        console.log('Modal dismissed');
      }
    );
  }
  
  getAllDrivers() {
    this.driversList = [];

    this.http.get<any>(`${baseUrl}/api/getDrivers`, {
                headers: new HttpHeaders({
                  'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
                })}).subscribe({
          next: (data) => {
            this.driversList = data.drivers;
            this.drivers = this.driversList.slice(this.pageIndex, this.driversPerPage);
            
          },
          error: (error) => {
            console.error('Error fetching drivers:', error);
            this.toast.show('Failed to load drivers. Please try again later.', ToastType.ERROR);
          }
        });
  }
  get pageNumbers(): number[]{
    return Array(Math.ceil(this.driversList.length / this.driversPerPage))
    .fill(0).map((x,i)=>i+1);
  }
  changePage(page:any){
    this.selectedPage = page;
    this.slicedProducts();
  }
  slicedProducts(){
    this.pageIndex = (this.selectedPage - 1)*this.driversPerPage;
    let endIndex = (this.selectedPage - 1)*this.driversPerPage + this.driversPerPage;
    this.drivers = [];
    this.drivers = this.driversList.slice(this.pageIndex, endIndex);
  }

  toggleUserStatus(userId: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
  
    this.http.patch(`${baseUrl}/api/update-user-status/${userId}`, { enabled: newStatus }).subscribe({
      next: () => {
        this.toast.show(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`, ToastType.SUCCESS);
        this.getAllDrivers();  // refresh list
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        this.toast.show('Failed to update user status!', ToastType.ERROR);
      }
    });
  }
  
  async deleteUser(userId: string) {
    if (await this.confirmService.confirm('Delete User', 'Are you sure you want to delete this user?')) {
      this.http.delete(`${baseUrl}/api/delete-user/${userId}`).subscribe({
        next: () => {
          // Update the passengers list after deletion
          this.driversList = this.driversList.filter((user: any) => user.id !== userId);
          this.drivers = this.driversList.slice(this.pageIndex, this.driversPerPage);
          
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
