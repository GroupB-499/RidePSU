import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { baseUrl } from '../configs';
import { ToastService, ToastType } from '../toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  showOtpModal = false;
  email = '';

  accountForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService,
    private router: Router,private toast: ToastService) { }

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      role: ['', [Validators.required]]
    });
  }

  async openOtpModal() {
    if (this.accountForm.invalid) {
      this.toast.show('Please fill all the fields correctly.', ToastType.ERROR);
      return;
    }

    
      if(await this.checkEmailExists()){
        this.toast.show('Email already exists, please try with another email.', ToastType.ERROR);
        return;
      }

    const password = this.accountForm.get('password')?.value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/;
    console.log(password);
    if (!passwordRegex.test(password)) {
      this.toast.show('Password must have at least 8 characters(atleast 1 number), 1 uppercase letter and 1 special character.', ToastType.ERROR);
      return;
    }

    
    this.email = this.accountForm.value.email;

    this.showOtpModal = true;
  }

  async checkEmailExists(): Promise<boolean> {
    
    const email = this.accountForm.get('email')?.value;
    try {
      const response = await this.http.get<{ exists: boolean }>(`${baseUrl}/api/check-email/${email}`,{headers: new HttpHeaders({
                            'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
                          })}).toPromise();
      return response?.exists ?? false;
    } catch (error) {
      console.error('Error checking email:', error);
      return false; // Default to false in case of error
    }
  }


  handleOtpResult(isVerified: boolean) {
    this.showOtpModal = false;
    if (isVerified) {
      this.signup();
    } else {
      this.toast.show('OTP Verification Failed', ToastType.ERROR);
    }
  }

  signup(): void {
    if (this.accountForm.invalid) {
      this.toast.show('Please fill all the fields correctly.', ToastType.ERROR);
      return;
    }

    

    const formData = this.accountForm.value;

    // Make the HTTP POST request to the signup API
    this.http.post(`${baseUrl}/api/signup`, formData).subscribe({
      next: (response: any) => {
        this.toast.show(response.message || 'Signup successful!', ToastType.SUCCESS);

        this.authService.login(response.user, response.token);
        this.accountForm.reset();
        if (response.user.role == "user") {
          this.router.navigate(['/home']);

        } else {
          this.router.navigate(['/driverDash']);
        }
      },
      error: (error) => {
        console.error('Error during signup:', error.error['error']);
        this.toast.show(error.error['error'], ToastType.ERROR);
      }
    });
  }
}
