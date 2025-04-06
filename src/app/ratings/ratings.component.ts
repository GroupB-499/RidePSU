import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { baseUrl } from '../configs';
import { ToastService, ToastType } from '../toast.service';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {
  rating = 0;
  stars = [1, 2, 3, 4, 5];
  feedback = '';
  userId: string = '';
  username: string = '';
  apiUrl = `${baseUrl}/api/submit-rating`;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private toast: ToastService,
  ) { }

  ngOnInit() {
    this.userId = this.authService.getUserInfo().userId;
    this.username = this.authService.getUserInfo().name;
  }

  rate(value: number) {
    this.rating = value;
  }

  submitRating() {
    if (!this.rating) {
      alert('Please select a rating.');
      return;
    }

    const ratingData = {
      userId: this.userId,
      username: this.username,
      rating: this.rating,
      feedback: this.feedback
    };

    this.http.post(this.apiUrl, ratingData).subscribe(
      () => {
        console.log('Rating submitted successfully');
        this.toast.show('Rating submitted successfully', ToastType.SUCCESS);

        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error submitting rating:', error);
        this.toast.show('Error submitting rating', ToastType.ERROR);

      }
    );
  }
}
