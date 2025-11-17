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

    constructor(private http: HttpClient){}

    saveProject(timeframe: string, employees: any[], projectName: string): any{
        var employeeMap: Record< string, Record<number,number>> ={}
        employees.map(empl => {
            if(empl?.hours){
                empl.hours[6] = -1
            }
            employeeMap[empl?.name] = empl?.hours
        })
        console.log(employees)
        console.log(employeeMap)
        
        // return this.http.post<any>(this.apiUrl,{"employees": employeeMap, "timesheet":timesheet, "projectName":projectName}).pipe(
        //     map(response => {

        //         const res = response.body
        //         if (res){
        //         }
        //     })
        // )


    }


}