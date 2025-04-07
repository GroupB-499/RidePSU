import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingComponent } from './booking/booking.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverDashComponent } from './driver-dash/driver-dash.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { HomeComponent } from './home/home.component';
import { MapScreenComponent } from './live-tracking/map-screen.component';
import { LoginComponent } from './login/login.component';
import { OtpModalComponent } from './otp-modal/otp-modal.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SignupComponent } from './signup/signup.component';


import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { provideToastr, ToastrModule } from 'ngx-toastr';
import { MapsComponent } from './maps/maps.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RatingsComponent } from './ratings/ratings.component';
import { DriversComponent } from './admin/drivers/drivers.component';
import { PassengersComponent } from './admin/passengers/passengers.component';
import { AdminRatingsComponent } from './admin/ratings/ratings.component';
import { AdminSchedulesComponent } from './admin/schedules/schedules.component';
import { MyRatingsComponent } from './my-ratings/my-ratings.component';
import { ScheduleFormComponent } from './admin/schedule-form/schedule-form.component';
import { AssignDriverModalComponent } from './assign-driver-modal/assign-driver-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintsComponent } from './complaints/complaints.component';
import { MyComplaintsComponent } from './my-complaints/my-complaints.component';
import { AdminComplaintsComponent } from './admin/admin-complaints/admin-complaints.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

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
    AdminSchedulesComponent,
    RatingsComponent,
    MyBookingsComponent,
    NotificationsComponent,
    AdminRatingsComponent,
    DriversComponent,
    PassengersComponent,
    MyRatingsComponent,
    ScheduleFormComponent,
    AssignDriverModalComponent,
    ComplaintsComponent,
    MyComplaintsComponent,
    AdminComplaintsComponent,
    ConfirmModalComponent,
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot(),
    MatSnackBarModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiaGFzaGlyMTIiLCJhIjoiY2x3NTg1YWNoMWRxeDJpbXV0dXU3dDMxMiJ9.WrBZRJ6L6AnAGPJmr10leA', // Replace with your Mapbox token
    }),
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    
    AngularFireModule.initializeApp({"projectId":"ridepsu-8b9fc","appId":"1:996061760535:web:922b8e96b32f8dcc8a6052","storageBucket":"ridepsu-8b9fc.firebasestorage.app","apiKey":"AIzaSyDNfEo3bZ-x8MSh4btnjbgzLONryzrzHpA","authDomain":"ridepsu-8b9fc.firebaseapp.com","messagingSenderId":"996061760535","measurementId":"G-RM2960T6RG"}),
    provideFirebaseApp(() => initializeApp({"projectId":"ridepsu-8b9fc","appId":"1:996061760535:web:922b8e96b32f8dcc8a6052","storageBucket":"ridepsu-8b9fc.firebasestorage.app","apiKey":"AIzaSyDNfEo3bZ-x8MSh4btnjbgzLONryzrzHpA","authDomain":"ridepsu-8b9fc.firebaseapp.com","messagingSenderId":"996061760535","measurementId":"G-RM2960T6RG"})),
    NgbModule,
    
  ],
  providers: [provideAnimations(), 
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true, // Show close button
      progressBar: true, // Show progress bar
      newestOnTop: true, // Show newest toast first
      preventDuplicates: true // Prevent duplicate messages
    }),],
  bootstrap: [AppComponent]
})
export class AppModule { }
