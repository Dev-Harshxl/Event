import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventDto {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  category: string;
  createdById: number;
  isBlocked: boolean;
  imageFilename?: string;
  imageContentType?: string;
  imageData?: string;
}


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://localhost:7269/api/Events';

  constructor(private http: HttpClient) {}

  getEvents(filters?: {
    category?: string;
    from?: string;
    to?: string;
    location?: string;
    userId?: number;
    includeBlocked?: boolean;
  }): Observable<EventDto[]> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const val = (filters as any)[key];
        if (val !== undefined && val !== null) {
          params = params.set(key, val);
        }
      });
    }

    return this.http.get<EventDto[]>(this.apiUrl, { params });
  }
}
