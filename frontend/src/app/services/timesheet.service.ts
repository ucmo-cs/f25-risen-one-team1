// src/app/services/timesheet.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface TimesheetDTO {
  projectName: string;
  timeframe: string;
  employees: Array<{ name: string; hours: Record<number, number> }>;
}

@Injectable({ providedIn: 'root' })
export class TimesheetService {
  private apiUrl = 'https://66w84tfuvb.execute-api.us-east-1.amazonaws.com/getTimesheet';
  // private apiUrl = 'http://localhost:3000/getTimesheet'
  constructor(private http: HttpClient) {}

  getTimesheet(projectName: string, timeframe: string): Observable<TimesheetDTO> {
    const body = { projectName, timeframe };

    return this.http.post<any>(this.apiUrl, body).pipe(
      map((raw) => this.formatTimesheet(raw)),
      catchError((err) => {
        // Always emit a normalized empty object on error
        return of({
          projectName,
          timeframe,
          employees: []
        } as TimesheetDTO);
      })
    );
  }

 private formatTimesheet(data: any): TimesheetDTO {
   if (!data || typeof data !== 'object') {
     return { projectName: '', timeframe: '', employees: [] };
   }

   const projectName = data.project_name?.S ?? data.project_name ?? '';
   const timeframe = data.timeframe?.S ?? data.timeframe ?? '';

   const employeesData = data.Employees?.M ?? data.Employees ?? {};
   const employees: Array<{ name: string; hours: Record<number, number> }> = [];

   for (const [employeeName, entry] of Object.entries(employeesData)) {
     const rawDays = (entry as any).M ?? entry;
     const dayHours: Record<number, number> = {};

     for (const [day, value] of Object.entries(rawDays)) {
       const hour = Number((value as any).N ?? value);
       if (!isNaN(hour)) {
         dayHours[Number(day)] = hour;
       }
     }

     employees.push({ name: employeeName, hours: dayHours });
   }

   return { projectName, timeframe, employees };
 }
}
