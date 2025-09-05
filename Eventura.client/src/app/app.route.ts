import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EventsComponent } from './features/events/events.component';
import { authGuard } from './guards/auth.guard';
import { OrganizeComponent } from './features/organize/organize.component';
import { ContactComponent } from './features/contact/contact.component';
import { Error404 } from './features/error404/error404.component';

export const routes: Routes = [
   { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'event', component: EventsComponent, canActivate: [authGuard] },
  { path: 'organize', component: OrganizeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: Error404 },
 
];
