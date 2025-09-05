import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isSidenavOpen = false;
  isLoggedIn = false;
  username: string | null = null;

  private subs: Subscription[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // 🔹 Reactively listen to login state
    this.subs.push(
      this.authService.isLoggedIn$.subscribe(status => {
        this.isLoggedIn = status;
      })
    );

    // 🔹 Reactively listen to username
    this.subs.push(
      this.authService.usernameObs$.subscribe(name => {
        this.username = name;
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
