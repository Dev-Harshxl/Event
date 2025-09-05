import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css']
})
export class Error404 {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }
}
