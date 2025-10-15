import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = "https://66w84tfuvb.execute-api.us-east-1.amazonaws.com/"
  // url: string = "http://localhost:3000/"
  constructor(private http: HttpClient,private router: Router) { }

  login(username: string, password: string): Observable<boolean> {
    // Your login logic with Lambda function
    // Simulating success for demonstration purposes
    return new Observable<boolean>((observer) => {
      const body = {
        "username": username,
        "password": password
      }
      this.http.post<HttpResponse<any>>(
        `${this.url}login`,
        body, 
        {observe: 'response'})
      .subscribe({
        next: (res: HttpResponse<any>) => {
          if (res.status == 200){ // Correct info
            observer.next(true); // Notify subscribers that login was successful
            observer.complete(); // Complete the observable
          }
        },
        error: (error) => {

        //   console.error('Login HTTP error:', {
        //   url: error?.url,
        //   status: error?.status,
        //   statusText: error?.statusText,
        //   headers: error?.headers,
        //   errorBody: error?.error // this is the Lambda JSON if any
        // });


          if (error.status == 401){
            observer.next(false)
            observer.complete()
          } else {
            observer.error(`${error.error}`);
          }
        }
      })
    });
  }

  logout() {
    // Your logout logic with Lambda function
    // Simulating success for demonstration purposes
    const logoutSuccess = true;

    if (logoutSuccess) {
      // Redirect to login page or any other desired page
      this.router.navigate(['/login']);
    } else {
      // Handle logout failure
      console.error('Logout failed');
    }
  }
}