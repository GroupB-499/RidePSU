import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverDashComponent } from './driver-dash/driver-dash.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { HomeComponent } from './home/home.component';
import { MapScreenComponent } from './live-tracking/map-screen.component';
import { LoginComponent } from './login/login.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RatingsComponent } from './ratings/ratings.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SignupComponent } from './signup/signup.component';
import { PassengersComponent } from './admin/passengers/passengers.component';
import { DriversComponent } from './admin/drivers/drivers.component';
import { AdminSchedulesComponent } from './admin/schedules/schedules.component';
import { AdminRatingsComponent } from './admin/ratings/ratings.component';
import { MyRatingsComponent } from './my-ratings/my-ratings.component';
import { ScheduleFormComponent } from './admin/schedule-form/schedule-form.component';
import { AdminComplaintsComponent } from './admin/admin-complaints/admin-complaints.component';
import { MyComplaintsComponent } from './my-complaints/my-complaints.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { LoginGuard } from './guards/login.guard';
import { AdminGuard } from './guards/admin.guard';
import { SignUpGuard } from './guards/signup.guard';
import { PassengerGuard } from './guards/passenger.guard';


const routes: Routes = [
  // normal routes
  {
    path:'',redirectTo: 'login',pathMatch:'full'
  },{ path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [SignUpGuard] },
  { path: 'home', component: HomeComponent, canActivate: [PassengerGuard] },
  { path: 'map', component: MapScreenComponent, canActivate: [PassengerGuard] },
  { path: 'edit-user', component: EditAccountComponent },
  { path: 'reset', component: ResetPasswordComponent, canActivate: [LoginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [PassengerGuard] },
  { path: 'schedules', component: SchedulesComponent, canActivate: [PassengerGuard] },
  { path: 'booking', component: BookingComponent ,  canActivate: [PassengerGuard]},
  { path: 'notifications', component: NotificationsComponent, canActivate: [PassengerGuard] },
  { path: 'myBookings', component: MyBookingsComponent, canActivate: [PassengerGuard] },
  { path: 'driverDash', component: DriverDashComponent, canActivate: [PassengerGuard] },
  { path: 'ratings', component: RatingsComponent, canActivate: [PassengerGuard] },
  { path: 'complaints', component: ComplaintsComponent ,  canActivate: [PassengerGuard]},
  { path: 'myRatings', component: MyRatingsComponent, canActivate: [PassengerGuard] },
  { path: 'myComplaints', component: MyComplaintsComponent ,  canActivate: [PassengerGuard]},

  // admin panel routes
  { path: 'passenger', component: PassengersComponent, canActivate: [AdminGuard] },
  { path: 'driver', component: DriversComponent, canActivate: [AdminGuard] },
  { path: 'admin-schedules', component: AdminSchedulesComponent , canActivate: [AdminGuard] },
  { path: 'admin-ratings', component: AdminRatingsComponent,  canActivate: [AdminGuard] },
  { path: 'admin-complaints', component: AdminComplaintsComponent,  canActivate: [AdminGuard] },
  { path: 'schedule-form', component: ScheduleFormComponent,  canActivate: [AdminGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
 }
