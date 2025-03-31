import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { baseUrl } from '../configs';
import { ToastService, ToastType } from '../toast.service';

@Component({
  selector: 'app-otp-modal',
  templateUrl: './otp-modal.component.html',
  styleUrls: ['./otp-modal.component.css']
})
export class OtpModalComponent implements OnInit {
  @Input() email: string = ''; 
  @Output() otpVerified = new EventEmitter<boolean>(); 

  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  otp5: string = '';
  otp6: string = '';

  constructor(private http: HttpClient,private toast: ToastService) {}

  ngOnInit() {
    this.sendOtp();
  }

  sendOtp() {
    this.http.post(`${baseUrl}/api/send-otp`, { email: this.email }).subscribe({
      next: () => console.log('OTP Sent!'),
      error: (err) => console.error('Error sending OTP:', err)
    });
  }

  verifyOtp() {
    const enteredOtp = this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
    
    this.http.post(`${baseUrl}/api/verify-otp`, { email: this.email, otp: enteredOtp }).subscribe({
      next: (response: any) => {
          this.toast.show('OTP Verified!', ToastType.SUCCESS);
          this.otpVerified.emit(true);
          
      },
      error: (err) => {
        this.toast.show('Error verifying OTP', ToastType.ERROR);
        console.error('Error:', err);
      }
    });
  }
  focusNext(event: any, fieldIndex: number) {
    if (event.target.value.length === 1) {
      const nextInput = document.getElementsByName('otp' + (fieldIndex + 1))[0] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
  
}
