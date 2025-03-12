import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | undefined;
  private messagesSubject = new Subject<any>();
  messages: Observable<any> = this.messagesSubject.asObservable();

  connect() {
    this.socket = new WebSocket('ws://localhost:3000');

    this.socket.onmessage = (event) => {
      this.messagesSubject.next(JSON.parse(event.data));
    };
  }

  sendMessage(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
