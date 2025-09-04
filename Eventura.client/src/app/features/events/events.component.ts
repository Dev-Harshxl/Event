import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NavbarComponent } from '../../shared/navbar/navbar.component'
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  imports: [CommonModule, FormsModule, ScrollingModule, NavbarComponent, FooterComponent]
})
export class EventsComponent implements OnInit {
  allCards: any[] = [];
  displayedCards: any[] = [];
  searchQuery = '';

  constructor() {}

  ngOnInit(): void {
    this.allCards = this.generateAllCards();
    this.displayedCards = [...this.allCards]; // initial load
  }

  /** Generate random shuffled event cards */
  private generateAllCards() {
    const types = ['movie', 'music', 'social', 'comedy', 'nearby'];
    let cards: any[] = [];

    types.forEach(type => {
      for (let i = 1; i <= 4; i++) {
        cards.push({
          img: `assets/cards/${type}${i}.jpg`,
          title: `${type} Event ${i}`,
          category: type
        });
      }
    });

    return this.shuffleArray(cards);
  }

  /** Fisher-Yates shuffle */
  private shuffleArray(array: any[]) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /** Infinite scroll handler */
  onScrollIndexChange(event: any) {
    // if user scrolls near bottom, append more random cards
    if (event > this.displayedCards.length - 10) {
      this.displayedCards = [...this.displayedCards, ...this.shuffleArray(this.allCards)];
    }
  }

  /** Search filter */
  filterCards() {
    const query = this.searchQuery.toLowerCase();
    if (!query) {
      this.displayedCards = [...this.allCards];
      return;
    }
    this.displayedCards = this.allCards.filter(
      c => c.title.toLowerCase().includes(query) || c.category.toLowerCase().includes(query)
    );
  }
}
