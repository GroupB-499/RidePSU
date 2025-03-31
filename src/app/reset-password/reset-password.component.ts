import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { baseUrl } from '../configs';
import { ToastService, ToastType } from '../toast.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  showOtpModal = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,private toast: ToastService) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  sendOtp() {
    this.showOtpModal = true;
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.http.post(`${baseUrl}/api/reset-password`, { email: this.resetPasswordForm.value.email, newPassword: this.resetPasswordForm.value.password })
        .subscribe({
          next: () => {
            this.toast.show('Password reset successfully!', ToastType.SUCCESS);
            
          this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Error sending OTP:', err);
            this.toast.show('Failed to send OTP. Please try again.', ToastType.ERROR);
          }
        });
    }
  }


  handleOtpVerification(isVerified: boolean) {
    this.showOtpModal = false; // Close modal
    if (isVerified) {
      this.resetPassword();
    } else {
      this.toast.show('Invalid OTP, please try again.', ToastType.ERROR);
    }
  }
}
