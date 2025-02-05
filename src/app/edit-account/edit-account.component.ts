import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent {

  accountForm!: FormGroup;
  showOtpModal = false;

  private initUserData: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService,
    private router: Router,) { }

  ngOnInit(): void {
    this.initUserData = this.authService.getUserInfo();
    this.accountForm = this.fb.group({
      userId: [this.initUserData.userId],
      name: [this.initUserData.name, [Validators.required]],
      email: [this.initUserData.email, [Validators.required, Validators.email]],
      phone: [this.initUserData.phone, [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      role: [this.initUserData.role, [Validators.required]]
    });
  }

  
  handleOtpVerification(isVerified: boolean) {
    this.showOtpModal = false; // Close modal
    if (isVerified) {
      this.update();
    } else {
      alert('Invalid OTP, please try again.');
    }
  }

  shouldSendOtp(){
    if(this.initUserData.email !== this.accountForm.value.email){
      this.showOtpModal = true;
    }else{
      this.update();
    }
  }

  update(): void {
    if (this.accountForm.invalid) {
      alert('Please fill all the fields correctly.');
      return;
    }

    const formData = this.accountForm.value;

    // Make the HTTP POST request to the signup API
    this.http.put('http://localhost:3000/api/edit-user', formData).subscribe({
      next: (response: any) => {
        alert(response.message || 'Updated successfully!');

        this.authService.login(response.user, response.token);
        this.accountForm.reset();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error during updation:', error);
        alert(error.error?.message || 'Updating failed. Please try again.');
      }
    });
  }
}
