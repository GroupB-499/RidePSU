import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { baseUrl } from '../configs';

@Component({
  selector: 'app-my-complaints',
  templateUrl: './my-complaints.component.html',
  styleUrls: ['./my-complaints.component.css']
})
export class MyComplaintsComponent {
  complaint: any[] = [];
  replyForms: Map<string, FormGroup> = new Map(); // ✅ Create a separate form for each rating

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.getComplaints();
  }

  getComplaints() {
    this.http.get<any>(`${baseUrl}/api/get-my-complaints/${this.authService.getUserInfo().userId}`).subscribe((data) => {
      this.complaint = data.complaints;
    });
  }

  // Create a separate form for each rating that has no reply
  getReplyForm(complaintId: string): FormGroup {
    if (!this.replyForms.has(complaintId)) {
      this.replyForms.set(complaintId, this.fb.group({ replyText: [''] }));
    }
    return this.replyForms.get(complaintId)!;
  }

}
