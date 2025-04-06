import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { baseUrl } from '../configs';
import { ToastService, ToastType } from '../toast.service';
import { WebSocketService } from '../websocket.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent {
  feedback = '';
  userId: string = '';
  username: string = '';
  apiUrl = `${baseUrl}/api/submit-complaint`;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private toast: ToastService,
    private wsService: WebSocketService
  ) { }

  ngOnInit() {
    this.userId = this.authService.getUserInfo().userId;
    this.username = this.authService.getUserInfo().name;
    this.wsService.connect();
  }

  submitComplaint() {
    const complaintData = {
      userId: this.userId,
      username: this.username,
      feedback: this.feedback
    };

    this.http.post(this.apiUrl, complaintData).subscribe(
      () => {
        console.log('Complaint submitted successfully');
                this.toast.show('Complaint submitted successfully', ToastType.SUCCESS);
    this.wsService.sendMessage({ type: "complaint",});
        
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error submitting complaint:', error);
                this.toast.show('Error submitting complaint', ToastType.ERROR);
        
      }
    );
  }
}
