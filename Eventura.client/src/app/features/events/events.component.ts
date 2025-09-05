import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

interface Event {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  category: string;
  image?: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  imports: [CommonModule, FormsModule, ScrollingModule, NavbarComponent, FooterComponent]
})
export class EventsComponent implements OnInit {
  allCards: Event[] = [];
  displayedCards: Event[] = [];
  searchQuery = '';
  categories: string[] = [];
  selectedCategory = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  /** Fetch events from API */
 fetchEvents() {
  this.http.get<Event[]>('https://localhost:7269/api/Events').subscribe({
    next: (data) => {
      this.allCards = data.map(e => ({
        ...e,
        image: `https://localhost:7269/api/Events/${e.id}/image`
      }));
      this.displayedCards = [...this.allCards];

      // Extract unique categories
      this.categories = Array.from(new Set(this.allCards.map(e => e.category)));
    },
    error: (err) => console.error(' Error fetching events:', err)
  });
}

  /** Infinite scroll handler */
  onScrollIndexChange(event: any) {
    if (event > this.displayedCards.length - 10) {
      this.displayedCards = [...this.displayedCards, ...this.allCards];
    }
  }

  /** Search + category filter */
  filterCards() {
    const query = this.searchQuery.toLowerCase();
    this.displayedCards = this.allCards.filter(c => {
      const matchesSearch =
        !query || c.title.toLowerCase().includes(query) || c.category.toLowerCase().includes(query);
      const matchesCategory =
        !this.selectedCategory || c.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }
}
