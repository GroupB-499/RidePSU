import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { baseUrl } from 'src/app/configs';

@Component({
  selector: 'app-admin-complaints',
  templateUrl: './admin-complaints.component.html',
  styleUrls: ['./admin-complaints.component.css']
})
export class AdminComplaintsComponent {
complaint: any[] = [];
  replyForms: Map<string, FormGroup> = new Map(); // ✅ Create a separate form for each rating

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.getComplaints();
  }

  getComplaints() {
    this.http.get<any>(`${baseUrl}/api/get-complaints`).subscribe((data) => {
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

  submitReply(complaintId: string) {
    const form = this.getReplyForm(complaintId);
    const replyText = form.value.replyText.trim();

    if (!replyText) return;

    this.http.patch(`${baseUrl}/api/update-complaint/${complaintId}`, { reply: replyText }).subscribe(
      () => {
        const complaint = this.complaint.find(r => r.id === complaintId);
        if (complaint) complaint.reply = replyText; // ✅ Update UI immediately
      },
      (error) => console.error('Error submitting reply:', error)
    );
  }
}
