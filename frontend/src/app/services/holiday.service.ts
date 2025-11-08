import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';

export interface PublicHoliday {
  // basic variables
  date: string;        // "2025-11-27"
  localName: string;   // e.g., "Thanksgiving Day"
  name: string;        // English name
  countryCode: string; // "US"
  fixed: boolean;
  global: boolean;
  counties?: string[] | null;
  types?: string[];
}

@Injectable({ providedIn: 'root' })
export class HolidayService {
  // Simple year+country cache so we don’t refetch repeatedly
  private cache = new Map<string, Observable<PublicHoliday[]>>();

  constructor(private http: HttpClient) {}

  getPublicHolidays(year: number, countryCode: string): Observable<PublicHoliday[]> {
    const key = `${year}-${countryCode.toUpperCase()}`;
    if (!this.cache.has(key)) {
      const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
      const req$ = this.http.get<PublicHoliday[]>(url).pipe(
        map(list => (list ?? []).map(h => ({ ...h } as PublicHoliday))),
        shareReplay(1)
      );
      this.cache.set(key, req$);
    }
    return this.cache.get(key)!;
  }
}
