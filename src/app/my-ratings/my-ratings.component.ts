import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { baseUrl } from '../configs';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-my-ratings',
  templateUrl: './my-ratings.component.html',
  styleUrls: ['./my-ratings.component.css']
})
export class MyRatingsComponent {
rating: any[] = [];
  replyForms: Map<string, FormGroup> = new Map(); // ✅ Create a separate form for each rating

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.getRatings();
  }

  getRatings() {
    this.http.get<any>(`${baseUrl}/api/get-my-ratings/${this.authService.getUserInfo().userId}`).subscribe((data) => {
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

}
