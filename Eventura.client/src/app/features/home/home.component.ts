import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef
} from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  isSidenavOpen = false;
  logoHidden = false;

slides = [
  {
    img: 'asse/slider/slideone.jpg',
    title: 'Feel the Beat',
    text: 'Join the most electrifying musical events and concerts around you.'
  },
  // {
  //   img: 'assets/slider/slidetwo.jpg',
  //   title: 'Game On!',
  //   text: 'Catch the thrill of sports events, from football matches to tournaments.'
  // },
  // {
  //   img: 'assets/slider/slidethree.jpg',
  //   title: 'Big Screen Magic',
  //   text: 'Experience the latest blockbusters and movie nights with friends.'
  // },
  // {
  //   img: 'assets/slider/slidefour.jpg',
  //   title: 'Words that Inspire',
  //   text: 'Be part of soulful poetry readings and open mic sessions.'
  // },
  // {
  //   img: 'assets/slider/slidefive.jpg',
  //   title: 'Celebrate Creativity',
  //   text: 'Explore mesmerizing art exhibitions and creative workshops.'
  // },
  // {
  //   img: 'assets/slider/slidesix.jpg',
  //   title: 'Wander & Wonder',
  //   text: 'Discover breathtaking destinations with curated travel events.'
  // }
];


  categories: { title: string; cards: any[] }[] = [];

  currentIndex = 0;
  intervalId: any;

  private sections: HTMLElement[] = [];
  private currentSectionIndex = 0;
  private isScrolling = false;

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {
    this.categories = [
      { title: 'Movies', cards: this.generateCards('movie') },
      { title: 'Musical Events', cards: this.generateCards('music') },
      { title: 'Social Gatherings', cards: this.generateCards('social') },
      { title: 'StandUps', cards: this.generateCards('comedy') },
      { title: 'Happening Around You', cards: this.generateCards('nearby') }
    ];
    this.startAutoSlide();
  }

  ngAfterViewInit(): void {
    this.sections = Array.from(
      this.elRef.nativeElement.querySelectorAll('.section')
    );

    // 👇 Attach scroll listener to .home-page
    const homePage = this.elRef.nativeElement.querySelector('.home-page');
    if (homePage) {
      homePage.addEventListener('scroll', () => this.onScroll(homePage));
    }
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

  private generateCards(type: string) {
    return Array.from({ length: 12 }).map((_, i) => {
      const path = `assets/cards/${type}${i + 1}.jpg`;
      console.log("paht ",type, path)
      return {
        img: path,
        title: `${type} Event ${i + 1}`,
        category: type
      };
    });
  }

  private onScroll(homePage: HTMLElement) {
    const secondSection = this.sections[1]; // Movies section
    if (!secondSection) return;

    const rect = secondSection.getBoundingClientRect();
    const containerRect = homePage.getBoundingClientRect();

    // check if second section touches top of scroll container
    if (rect.top - containerRect.top <= 50) {
      this.logoHidden = true;
    } else {
      this.logoHidden = false;
    }
  }

  // ========= Smooth Scroll Section by Section =========
  private scrollToSection(index: number) {
    if (index < 0 || index >= this.sections.length) return;

    this.isScrolling = true;
    this.currentSectionIndex = index;

    this.sections[index].scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      this.isScrolling = false;
    }, 1000);
  }
}
