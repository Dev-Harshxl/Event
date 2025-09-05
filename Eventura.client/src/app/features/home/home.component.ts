import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { EventService, EventDto } from '../../services/event.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { } from '../rsvp/rsvp-dialog.component';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../shared/notification/notification.service';
import { RsvpDialogComponent } from '../rsvp/rsvp-dialog.component';

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
    RouterModule,
    MatMenuModule,
    RouterModule,
  ],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  isSidenavOpen = false;
  logoHidden = false;
  isLoggedIn = false;
  username: string | null = null;
  categories: { title: string; cards: EventDto[] }[] = [];
  slides = [
    {
      img: 'assets/slider/slideone.jpg',
      title: 'Feel the Beat',
      text: 'Join the most electrifying musical events and concerts around you.',
    },
    {
      img: 'assets/slider/slidetwo.jpg',
      title: 'Game On!',
      text: 'Catch the thrill of sports events, from football matches to tournaments.',
    },
    {
      img: 'assets/slider/slidethree.jpg',
      title: 'Big Screen Magic',
      text: 'Experience the latest blockbusters and movie nights with friends.',
    },
    {
      img: 'assets/slider/slidefour.jpg',
      title: 'Words that Inspire',
      text: 'Be part of soulful poetry readings and open mic sessions.',
    },
    {
      img: 'assets/slider/slidefive.jpg',
      title: 'Celebrate Creativity',
      text: 'Explore mesmerizing art exhibitions and creative workshops.',
    },
    {
      img: 'assets/slider/slidesix.jpg',
      title: 'Wander & Wonder',
      text: 'Discover breathtaking destinations with curated travel events.',
    },
  ];



  currentIndex = 0;
  intervalId: any;

  private sections: HTMLElement[] = [];
  private currentSectionIndex = 0;
  private isScrolling = false;
  private subs: Subscription[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private elRef: ElementRef,
    private eventService: EventService,
    private dialog: MatDialog,
    private http: HttpClient,
    private notify: NotificationService,
  ) { }
  openRsvpDialog(event: EventDto) {
    if (!this.isLoggedIn) {
      this.notify
        .openDialog('Login Required', '⚠️ Please login to book your spot.')
        .afterClosed()
        .subscribe((confirmed) => {
          if (confirmed) {
            this.router.navigate(['/login']);
          }
        });
      return;
    }

    // 🔹 Get email from token (auth service should decode token claims)
    const email = this.authService.getUsername();

    const dialogRef = this.dialog.open(RsvpDialogComponent, {
      width: '400px',
      data: { eventId: event.id, eventTitle: event.title, email }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post(`https://localhost:7269/api/Events/${event.id}/rsvp`, {
          status: result.status
        }).subscribe({
          next: () => this.notify.showMessage('✅ RSVP confirmed!'),
          error: (err) => {
            if (err.status === 409) {
              this.notify.showMessage('⚠️ You have already RSVP’d for this event.');
            } else {
              this.notify.showMessage('❌ Failed to RSVP. Try again later.');
            }
          }
        });
      }
    });
  }

  ngOnInit(): void {
    // Fetch events from API
    this.eventService.getEvents({ includeBlocked: false }).subscribe(events => {
      // 🔹 Group by category
      const grouped = this.groupEventsByCategory(events);

      this.categories = Object.keys(grouped).map(cat => ({
        title: cat,
        cards: grouped[cat]
      }));
    });

    this.startAutoSlide();

    // Auth stuff
    this.subs.push(
      this.authService.isLoggedIn$.subscribe(status => {
        this.isLoggedIn = status;
      })
    );

    this.subs.push(
      this.authService.usernameObs$.subscribe(name => {
        this.username = name;
      })
    );



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

  private groupEventsByCategory(events: EventDto[]): Record<string, EventDto[]> {
    return events.reduce((acc, ev) => {
      const key = ev.category || 'Other';
      if (!acc[key]) acc[key] = [];
      acc[key].push(ev);
      return acc;
    }, {} as Record<string, EventDto[]>);
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

  onImageError(e: Event) {
    const img = e.target as HTMLImageElement | null;
    if (img) img.src = 'assets/placeholder.jpg';
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }




}
