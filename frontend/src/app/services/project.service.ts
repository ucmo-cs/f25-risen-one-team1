
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Project {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {


  private apiUrl = 'https://66w84tfuvb.execute-api.us-east-1.amazonaws.com/projects';

  constructor(private http: HttpClient) {}

  // Fetches projects from backend
  getProjects(): Observable<Project[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {

        if (response && Array.isArray(response.projects)) {
          return response.projects.map((p: string, index: number) => ({
            id: String(index + 1),
            name: p
          }));
        }
        return [];
      }),
      catchError(err => {
        console.error('ProjectService.getProjects error', err);
        return of([] as Project[]);
      })
    );
  }
}
