import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../../services/signalr.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  imports: [CommonModule, FormsModule],
  providers: [SignalrService],
})
export class ChatRoomComponent implements OnInit {
  user = '';
  message = '';

  constructor(private signalrService: SignalrService) {}

  ngOnInit() {
    this.connectSignalR();
  }

  sendMessage(): void {
    this.signalrService.send('Chandra', 'Hello Alvin!');
  }

  private connectSignalR(): void {
    this.signalrService.connect().then(() => {
      console.log('FE Connected: 🔥🔥🔥!');

      this.signalrService
        .getHubConnection()
        .on('SuccessSendMessage', (user, message) => {
          console.log({ user, message });
        });
    });
  }
}
