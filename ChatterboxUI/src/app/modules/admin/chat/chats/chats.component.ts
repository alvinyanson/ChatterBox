import { NgClass, NgFor, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
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
    selector: 'chat-chats',
    templateUrl: './chats.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        NgIf,
        NewChatComponent,
        ProfileComponent,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        NgFor,
        NgClass,
        RouterLink,
        RouterOutlet,
    ],
})
export class ChatsComponent implements OnInit, OnDestroy {
    chats: Chat[] = [];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: Chat[] = [];
    copyFilteredChats: Chat[];
    sessionId: string;

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
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Chats
        this._chatService.chats$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chats: Chat[]) => {
                this.copyFilteredChats = chats;

                this.connectSignalR();
            });

        // Profile
        this._chatService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((profile: Profile) => {
                this.profile = profile;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Selected chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.selectedChat = chat;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
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
    filterChats(query: string): void {
        // Reset the filter
        if (!query) {
            this.filteredChats = this.chats;
            return;
        }

        this.filteredChats = this.chats.filter((chat) =>
            chat.contact.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    /**
     * Open the new chat sidebar
     */
    openNewChat(): void {
        this.drawerComponent = 'new-chat';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Open the profile sidebar
     */
    openProfile(): void {
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
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    getFilteredChats(): Chat[] {
        return JSON.parse(localStorage.getItem('filteredChats')) || [];
    }

    getInitUser(): Chat | null {
        return JSON.parse(localStorage.getItem('initUser'));
    }

    clearLocalData(): void {
        localStorage.removeItem('initUser');
        localStorage.removeItem('filteredChats');
        localStorage.removeItem('nextIndex');
    }

    private connectSignalR(): void {
        this.refreshChatList();

        this._signalrService.connect().then(() => {
            // SUCCESS CONNECTION
            console.log('FE Connected: 🔥🔥🔥!');

            const sessionId =
                this._signalrService.getHubConnection().connectionId;

            this.sessionId = sessionId;

            let initUser = this.getInitUser();

            if (!initUser) {
                let currentIndex =
                    Number(localStorage.getItem('nextIndex')) || 0;

                initUser = this.copyFilteredChats[0];

                localStorage.setItem(
                    'initUser',
                    JSON.stringify(this.copyFilteredChats[0])
                );

                initUser.sessionId = this.sessionId;

                this.chats.push(initUser);

                this.filteredChats.push(initUser);

                localStorage.setItem(
                    'filteredChats',
                    JSON.stringify(this.filteredChats)
                );

                localStorage.setItem('nextIndex', String(currentIndex + 1));

                this._changeDetectorRef.markForCheck();
            }

            // JOINED A PARTY
            this._signalrService
                .getHubConnection()
                .on('JoinParty', (user, message) => {
                    console.log('Join party: ', { user, message });

                    const currentIndex =
                        Number(localStorage.getItem('nextIndex')) || 0;

                    const incomingUser = this.copyFilteredChats[currentIndex];

                    if (incomingUser) {
                        incomingUser.sessionId = user;

                        this.chats.push(incomingUser);
                        this.filteredChats.push(incomingUser);

                        localStorage.setItem(
                            'filteredChats',
                            JSON.stringify(this.filteredChats)
                        );

                        localStorage.setItem(
                            'nextIndex',
                            String(currentIndex + 1)
                        );
                    }

                    this.chats = this.getFilteredChats();
                    this.filteredChats = this.getFilteredChats();

                    this._changeDetectorRef.markForCheck();
                });

            // LEFT A PARTY
            this._signalrService
                .getHubConnection()
                .on('LeftParty', (user, message) => {
                    console.log('Left party: ', { user, message });

                    const disconnectedUserIndex = this.filteredChats.findIndex(
                        (u) => u.sessionId === user
                    );

                    if (disconnectedUserIndex !== -1) {
                        this.chats.splice(disconnectedUserIndex, 1);
                    }

                    // Update filteredChats reference
                    this.filteredChats = [...this.chats];

                    // Persist filteredChats to localStorage
                    localStorage.setItem(
                        'filteredChats',
                        JSON.stringify(this.filteredChats)
                    );

                    // Update nextIndex in localStorage
                    const currentIndex =
                        Number(localStorage.getItem('nextIndex')) || 0;
                    localStorage.setItem('nextIndex', String(currentIndex - 1));

                    // Refresh chat lists
                    this.chats = this.getFilteredChats();
                    this.filteredChats = [...this.chats];

                    // Trigger change detection
                    this._changeDetectorRef.markForCheck();
                });
        });
    }

    private refreshChatList(): void {
        this.chats = this.getFilteredChats();

        this.filteredChats = [...this.chats];

        this._changeDetectorRef.markForCheck();
    }
}
