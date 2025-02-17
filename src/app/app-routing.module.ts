import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverDashComponent } from './driver-dash/driver-dash.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MapScreenComponent } from './map-screen/map-screen.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SignupComponent } from './signup/signup.component';


const routes: Routes = [
  {
    path:'',redirectTo: 'login',pathMatch:'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'map', component: MapScreenComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'edit-user', component: EditAccountComponent },
  { path: 'reset', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'schedules', component: SchedulesComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'myBookings', component: MyBookingsComponent },
  { path: 'driverDash', component: DriverDashComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
 }
