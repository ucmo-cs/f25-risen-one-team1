import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface SaveProject {
    projectName: string;
    timeframe: string;
    employees: Map<string, Map<string, number>>
}

@Injectable({
  providedIn: 'root'
})
export class SavingService{
    private apiUrl = 'https://66w84tfuvb.execute-api.us-east-1.amazonaws.com/saveTimesheetMass'
    // private apiUrl = "http://localhost:3000/saveTimesheetMass"

    constructor(private http: HttpClient){}

    saveProject(timeframe: string, employees: any[], projectName: string): Observable<boolean>{
        var employeeMap: Record< string, Record<number,number>> ={}
        employees.map(empl => {
            employeeMap[empl?.name] = empl?.hours
        })
        console.log(employeeMap)
        return this.http.post<any>(this.apiUrl,{"employees": employeeMap, "timeframe":timeframe, "projectName":projectName}, {observe:"response"}).pipe(
            map(response => response.status >= 200 && response.status < 300)
        )
    }


}