import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Employee {
  name: string;
  hours: Record<number, number>;
}

interface Timesheet {
  employees: Employee[];
}

@Component({
  selector: 'app-timesheet-table',
  templateUrl: './timesheet-table.component.html',
  styleUrls: ['./timesheet-table.component.css']
})
export class TimesheetTableComponent {

  @Input() daysInMonth: number[] = [];
  @Input() timesheetData!: Timesheet;
  @Input() editing!: boolean;
  @Input() editingTimesheet!: Timesheet;
  @Input() formattedHolidays: any[] = [];

  @Input() isHoliday!: (day: number) => boolean;
  @Input() isWeekend!: (day: number) => boolean;
  @Input() isToday!: (day: number) => boolean;
  @Input() getDowLabel!: (day: number) => string;
  @Input() getTotalHours!: (hours: Record<number, number>) => number;
  @Input() getHolidayName!: (day: number) => string|null;

  @Output() updateHours = new EventEmitter<void>();
}
