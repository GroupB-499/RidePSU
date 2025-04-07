import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../configs';
import { ToastService, ToastType } from '../toast.service';
import { WebSocketService } from '../websocket.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html'
})
export class ComplaintsComponent {
  @Input() userId: string = '';
  @Input() username: string = '';

  feedback: string = '';
  apiUrl = `${baseUrl}/api/submit-complaint`;

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private toast: ToastService,
    private wsService: WebSocketService
  ) {
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
        this.toast.show('Vehicle Issue reported successfully', ToastType.SUCCESS);
        this.wsService.sendMessage({ type: "complaint" });
        this.activeModal.close(); // close the modal on success
      },
      error => {
        console.error('Error reporting Vehicle Issue:', error);
        this.toast.show('Error reporting Vehicle Issue', ToastType.ERROR);
      }
    );
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
