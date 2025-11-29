import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

interface Employee {
  name: string;
  hours: Record<number, number>;
}

interface Timesheet {
  employees: Employee[];
}

@Component({
  selector: 'app-pdf-timesheet',
  templateUrl: './pdf-timesheet.component.html',
  styleUrls: ['./pdf-timesheet.component.css']
})
export class PdfTimesheetComponent {

  @Input() selectedMonth!: string;
  @Input() currentYear!: number;
  @Input() daysInMonth: number[] = [];
  @Input() timesheetData!: Timesheet;
  @Input() isWeekend!: (day: number) => boolean;
  @Input() isHoliday!: (day: number) => boolean;
  @Input() getTotalHours!: (hours: Record<number, number>) => number;
}
