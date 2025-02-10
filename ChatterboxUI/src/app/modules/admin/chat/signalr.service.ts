import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private readonly hubConnection!: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7225/chathub')
      .build();
  }

  public getHubConnection() : HubConnection {
    return this.hubConnection;
  }

  public async connect(): Promise<void> {
    try {
      await this.hubConnection.start();
      console.log('SignalR connected');
    }
    catch(error) {
      console.error(`SignalR connection error: ${error}`)
    }
  }

  public async send(user: string, message: string): Promise<void> {
    try {
      await this.hubConnection.invoke("Send", user, message);
    }
    catch(error) {
      console.error(`Error invoking Send: ${error}`);
    }
  }

}
