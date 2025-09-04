import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    RouterModule
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  isSidenavOpen = false;

  slides = [
    { img: 'assets/slider/slide1.jpg', title: 'Discover Amazing Events', text: 'Find events around you and never miss out.' },
    { img: 'assets/slider/slide2.jpg', title: 'Join The Community', text: 'Meet new people and share experiences.' },
    { img: 'assets/slider/slide3.jpg', title: 'Plan Your Own Event', text: 'Easily create and manage your events.' },
    { img: 'assets/slider/slide4.jpg', title: 'Plan Your Own Event', text: 'Easily create and manage your events.' },
    { img: 'assets/slider/slide5.jpg', title: 'Plan Your Own Event', text: 'Easily create and manage your events.' },
    { img: 'assets/slider/slide6.jpg', title: 'Plan Your Own Event', text: 'Easily create and manage your events.' },
    { img: 'assets/slider/slide7.jpg', title: 'Plan Your Own Event', text: 'Easily create and manage your events.' },
    { img: 'assets/slider/slide8.jpg', title: 'Plan Your Own Event', text: 'Easily create and manage your events.' },
    { img: 'assets/slider/slide9.jpg', title: 'Plan Your Own Event', text: 'Easily create and manage your events.' },
    { img: 'assets/slider/slide10.jpg', title: 'Plan Your Own Event', text: 'Easily create and manage your events.' }
  ];

  currentIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  private startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }, 5000); 
  }
}
