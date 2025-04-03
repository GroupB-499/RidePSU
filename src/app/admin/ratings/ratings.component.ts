import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { baseUrl } from 'src/app/configs';


@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css'],
})
export class AdminRatingsComponent implements OnInit {
  rating: any[] = [];
  replyForms: Map<string, FormGroup> = new Map(); // ✅ Create a separate form for each rating

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.getRatings();
  }

  getRatings() {
    this.http.get<any>(`${baseUrl}/api/get-ratings`).subscribe((data) => {
      this.rating = data.ratings;
    });
  }

  // Create a separate form for each rating that has no reply
  getReplyForm(ratingId: string): FormGroup {
    if (!this.replyForms.has(ratingId)) {
      this.replyForms.set(ratingId, this.fb.group({ replyText: [''] }));
    }
    return this.replyForms.get(ratingId)!;
  }

  submitReply(ratingId: string) {
    const form = this.getReplyForm(ratingId);
    const replyText = form.value.replyText.trim();

    if (!replyText) return;

    this.http.patch(`${baseUrl}/api/update-rating/${ratingId}`, { reply: replyText }).subscribe(
      () => {
        const rating = this.rating.find(r => r.id === ratingId);
        if (rating) rating.reply = replyText; // ✅ Update UI immediately
      },
      (error) => console.error('Error submitting reply:', error)
    );
  }
}
