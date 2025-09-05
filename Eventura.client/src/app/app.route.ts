import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EventsComponent } from './features/events/events.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'event', component: EventsComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
