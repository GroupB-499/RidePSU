import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  showOtpModal = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
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
      this.http.post('http://localhost:3000/api/reset-password', { email: this.resetPasswordForm.value.email, newPassword: this.resetPasswordForm.value.password })
        .subscribe({
          next: () => {
            alert('Password reset successfully!');
            
          this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Error sending OTP:', err);
            alert('Failed to send OTP. Please try again.');
          }
        });
    }
  }


  handleOtpVerification(isVerified: boolean) {
    this.showOtpModal = false; // Close modal
    if (isVerified) {
      this.resetPassword();
    } else {
      alert('Invalid OTP, please try again.');
    }
  }
}
