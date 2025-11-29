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

  // ===== Inputs from parent (HomeComponent) =====
  @Input() daysInMonth: number[] = [];
  @Input() timesheetData!: Timesheet;
  @Input() editing!: boolean;
  @Input() editingTimesheet!: Timesheet;
  @Input() formattedHolidays: any[] = [];

  // Callback functions passed in from parent
  @Input() isHoliday!: (day: number) => boolean;
  @Input() isWeekend!: (day: number) => boolean;
  @Input() isToday!: (day: number) => boolean;
  @Input() getDowLabel!: (day: number) => string;
  @Input() getTotalHours!: (hours: Record<number, number>) => number;

  // ===== Outputs to inform parent of actions =====
  @Output() updateHours = new EventEmitter<void>();
}
