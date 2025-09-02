// layout.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private isReversedSubject = new BehaviorSubject<boolean>(false);
  isReversed$ = this.isReversedSubject.asObservable();

  setReversedState(isReversed: boolean) {
    this.isReversedSubject.next(isReversed);
  }
}