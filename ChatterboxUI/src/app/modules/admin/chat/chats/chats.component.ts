import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ChatService } from '../chat.service';
import { Chat, Profile } from '../chat.types';
import { Subject, takeUntil } from 'rxjs';
import { NewChatComponent } from '../new-chat/new-chat.component';
import { ProfileComponent } from '../profile/profile.component';
import { SignalrService } from '../signalr.service';
import { contacts } from 'app/mock-api/apps/chat/data';

@Component({
    selector       : 'chat-chats',
    templateUrl    : './chats.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatSidenavModule, NgIf, NewChatComponent, ProfileComponent, MatButtonModule, MatIconModule, MatMenuModule, MatFormFieldModule, MatInputModule, NgFor, NgClass, RouterLink, RouterOutlet],
})
export class ChatsComponent implements OnInit, OnDestroy
{
    chats: Chat[];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: Chat[];
    copyFilteredChats: Chat[];

    profile: Profile;
    selectedChat: Chat;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _signalrService: SignalrService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        this.connectSignalR();

        // Chats
        this._chatService.chats$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chats: Chat[]) =>
            {
                this.copyFilteredChats = chats;

                this.chats = this.filteredChats = chats.slice(0, 1);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Profile
        this._chatService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((profile: Profile) =>
            {
                this.profile = profile;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Selected chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) =>
            {
                this.selectedChat = chat;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter the chats
     *
     * @param query
     */
    filterChats(query: string): void
    {
        // Reset the filter
        if ( !query )
        {
            this.filteredChats = this.chats;
            return;
        }

        this.filteredChats = this.chats.filter(chat => chat.contact.name.toLowerCase().includes(query.toLowerCase()));
    }

    /**
     * Open the new chat sidebar
     */
    openNewChat(): void
    {
        this.drawerComponent = 'new-chat';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Open the profile sidebar
     */
    openProfile(): void
    {
        this.drawerComponent = 'profile';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }


    private connectSignalR(): void {
        this._signalrService.connect().then(() => {
            console.log('FE Connected: 🔥🔥🔥!');

            this._signalrService
                .getHubConnection()
                .on('SuccessSendMessage', (user, message) => {
                    console.log({ user, message });

                    // const incomingMsg = {
                    //     chatId: 'ff6bc7f1-449a-4419-af62-b89ce6cae0aa',
                    //     contact: contacts[0],
                    //     contactId: 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5df',
                    //     createdAt: '2025-02-03T18:56:46.946+08:00',
                    //     id: '2563bf15-4d8e-4e36-8526-3e709fb497d2',
                    //     isMine: true,
                    //     value: message,
                    // };


                    let incomingMsg = this.copyFilteredChats[1];
                    incomingMsg.sessionId = user;

                    this.filteredChats.push(incomingMsg);

                    console.log('incomingMsg', incomingMsg)


                    // this.chatForm.controls.message.setValue('');

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
        });
    }
}
