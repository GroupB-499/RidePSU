import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MapScreenComponent } from './map-screen/map-screen.component';
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
  { path: 'reset', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'schedules', component: SchedulesComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
 }
