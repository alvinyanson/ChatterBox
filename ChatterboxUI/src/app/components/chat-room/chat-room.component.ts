import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SignalrService } from '../../services/signalr.service';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [SignalrService],
})
export class ChatRoomComponent implements OnInit {
  chatForm = new FormGroup({
    user: new FormControl('Anonymous', Validators.required),
    message: new FormControl('', Validators.required),
    messages: new FormControl('')
  });

  constructor(private signalrService: SignalrService) {}

  private get currentUser(): string {
    return this.chatForm.controls.user.value ?? '';
  }

  private get message(): string {
    return this.chatForm.controls.message.value ?? '';
  }

  private get messages(): string {
    return this.chatForm.controls.messages.value ?? '';
  }

  ngOnInit() {
    this.connectSignalR();
  }

  sendMessage(): void {
    if (this.chatForm.invalid) return;
    this.signalrService.send(this.currentUser, this.message);
  }

  private connectSignalR(): void {
    this.signalrService.connect().then(() => {
      console.log('FE Connected: 🔥🔥🔥!');

      this.signalrService
        .getHubConnection()
        .on('SuccessSendMessage', (user: string, message: string) => {
          let incomingMsg = `${user}: ${message}`;
          let existingMsgs = this.messages;
          this.chatForm.controls.messages.setValue(existingMsgs += incomingMsg + "\n");

          this.chatForm.controls.message.setValue('');
        });
    });
  }
}
