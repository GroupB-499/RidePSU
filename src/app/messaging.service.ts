import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth-service.service';
import { baseUrl } from './configs';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private afMessaging: AngularFireMessaging, private snackBar: MatSnackBar, private authService: AuthService, private http: HttpClient, private firestore: AngularFirestore) {}
  private apiUrl = `${baseUrl}/api/saveFCMTokens`;

  requestPermission() {
    this.afMessaging.requestToken.subscribe(
      (token) => {
        console.log('Notification permission granted.', token);
        localStorage.setItem('fcmToken', token!);

         const user = this.authService.getUserInfo(); // { id, role }
         if (user) {
           this.saveTokenToBackend(user.userId, user.role, token!);
         }
      },
      (error) => {
        console.error('Error getting notification permission', error);
      }
    );
  }

  private saveTokenToBackend(userId: string, role: string, token: string) {

    this.http.post(this.apiUrl, { userId, role, token }).subscribe(
      () => console.log('FCM token saved successfully!'),
      (error) => console.error('Error saving FCM token:', error)
    );
  }

  receiveMessage() {
    this.afMessaging.messages.subscribe(
      (message) => {
        console.log('New message received:', message);
        const title = message.notification?.title || 'New Notification';
      const body = message.notification?.body || '';

      // Show Snackbar popup
      this.snackBar.open(`${title}: ${body}`, 'OK', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });


      }
    );
  }

}
