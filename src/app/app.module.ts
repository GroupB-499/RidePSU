import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingComponent } from './booking/booking.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverDashComponent } from './driver-dash/driver-dash.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MapScreenComponent } from './map-screen/map-screen.component';
import { OtpModalComponent } from './otp-modal/otp-modal.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SignupComponent } from './signup/signup.component';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { MapsComponent } from './maps/maps.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    SchedulesComponent,
    HomeComponent,
    MapScreenComponent,
    OtpModalComponent,
    ResetPasswordComponent,
    EditAccountComponent,
    BookingComponent,
    DriverDashComponent,
    MapsComponent,
    MyBookingsComponent
  ],
  imports: [
    BrowserModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiaGFzaGlyMTIiLCJhIjoiY2x3NTg1YWNoMWRxeDJpbXV0dXU3dDMxMiJ9.WrBZRJ6L6AnAGPJmr10leA', // Replace with your Mapbox token
    }),
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
