import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {provideNativeDateAdapter} from '@angular/material/core';



interface previousRequest {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-form',
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit {

  //stores text displayed as heading
  selectedMonth: string = 'Please select a month';
  //stores raw value form input month
  selectedMonthValue: string = '';
  //holds days of selected month
  daysInMonth: number[] = [];

  constructor (private router: Router ) {}

  /* Sign In navigation Function */
  ngOnInit(){
    //get current date
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

  //set default input value to current month/year
       this.selectedMonthValue = `${year}-${month}`;
      this.selectedMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });

      this.generateDays(year, Number(month));
      }
  signIn() {
    this.router.navigate(['/login']);
  }
  //called when user selects a new month
    onMonthChange(): void {
    //stop if no value is selected
      if(!this.selectedMonthValue) return;
  //splits into separate year and month parts
     const [year, month] = this.selectedMonthValue.split('-');
     const monthIndex = Number(month) - 1;

  //convert numeric month to full name
     const monthName = new Date(Number(year), monthIndex, 1)
       .toLocaleString('default', { month: 'long' });

  //update the display heading
      this.selectedMonth = `${monthName} ${year}`;

  //generate number of days for selected month
      this.generateDays(year, Number(month));
    }

  // creates an array of days for the selected month
    private generateDays(year: string | number, month: number): void{
    const numDays = new Date(Number(year), month, 0).getDate();

  //creates and array
    this.daysInMonth = Array.from({length:numDays}, (_,i) => i +1);
    }
}
