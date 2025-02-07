import { Routes } from '@angular/router';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { DmsComponent } from './pages/dms/dms.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'public' },
  { path: 'public', component: ChatRoomComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'dms', component: DmsComponent },
  { path: '**', pathMatch: 'full', redirectTo: '/planets'},
];
