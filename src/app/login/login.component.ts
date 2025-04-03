import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { baseUrl } from '../configs';
import { ToastService, ToastType } from '../toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup; 
  errorMessage: string = ''; 

  constructor(
    private fb: FormBuilder,  
    private http: HttpClient, 
    private router: Router,
private toast: ToastService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Initialize the form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  
      password: ['', [Validators.required]],    
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return; 
    }

    const loginData = this.loginForm.value;

    this.http.post(`${baseUrl}/api/login`, loginData).subscribe({
      next: (response:any) => {
        if (response) {
          this.authService.login(response.user, response.token);
          console.log(response);
          this.toast.show("Logged in successfully!",ToastType.SUCCESS);
          if(response.user.role == "user"){
            this.router.navigate(['/home']);

          }else if(response.user.role == "admin"){
            this.router.navigate(['/passenger']);
          }
          else{
            this.router.navigate(['/driverDash']);
          }
        } else {
          this.toast.show("Error during login. Please try again later.", ToastType.ERROR);
        }
      },
      error: (error) => {
        this.errorMessage = 'Error during login. Please try again later.';
        this.toast.show(error.error.error || this.errorMessage, ToastType.ERROR);
      }}
    );
  }
}
