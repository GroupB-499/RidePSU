import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { baseUrl } from '../configs';
import { ToastService, ToastType } from '../toast.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent {

  accountForm!: FormGroup;
  showOtpModal = false;
  title = 'Account Information';

  private initUserData: any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private http: HttpClient, private authService: AuthService, private toast: ToastService,
    private router: Router,) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      const name = params['name'];
      const phone = params['phone'];
      const email = params['email'];
      const role = params['role'];
      this.initUserData = {
        userId: userId,
        name: name,
        phone: phone,
        email: email,
        role: role
      };

      if (role == "driver") {
        this.title = 'Edit Driver';
      } else {
        this.initUserData = this.authService.getUserInfo();
      }
      console.log('Role:', this.accountForm.value.role);
    });
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
      this.toast.show('Invalid OTP, please try again.', ToastType.ERROR);
    }
  }

  shouldSendOtp() {
    if (this.initUserData.email !== this.accountForm.value.email) {
      this.showOtpModal = true;
    } else {
      this.update();
    }
  }

  update(): void {
    if (this.accountForm.invalid) {
      this.toast.show('Please fill all the fields correctly.', ToastType.ERROR);
      return;
    }

    const formData = this.accountForm.value;

    // Make the HTTP POST request to the signup API
    this.http.put(`${baseUrl}/api/edit-user`, formData).subscribe({
      next: (response: any) => {
        this.toast.show(response.message || 'Updated successfully!', ToastType.SUCCESS);

        this.authService.login(response.user, response.token);
        this.accountForm.reset();
        if (this.authService.getUserInfo().role == 'user') {
          this.router.navigate(['/home']);

        } else {
          this.router.navigate(['/driverDash']);

        }
      },
      error: (error) => {
        console.error('Error during updation:', error);
        this.toast.show(error.error?.message || 'Updating failed. Please try again.', ToastType.ERROR);
      }
    });
  }
}
