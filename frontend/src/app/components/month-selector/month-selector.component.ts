import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  Inject
} from '@angular/core';

import {
  NativeDateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
  DateAdapter
} from '@angular/material/core';

class MonthYearDateAdapter extends NativeDateAdapter {

  override format(date: Date): string {
    if (!date) return '';
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  // Prevent parsing failures
  override parse(value: any): Date | null {
    if (!value) return null;
    return new Date(value);
  }
}

const MONTH_YEAR_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'MMMM YYYY'
  },
  display: {
    dateInput: 'MMMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

/* ===============================================
   COMPONENT
   =============================================== */

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.css'],

  // Provide the adapter and formats directly here
  providers: [
    { provide: DateAdapter, useClass: MonthYearDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS }
  ]
})
export class MonthSelectorComponent implements OnChanges {

  @Input() selectedMonthValue!: string; // "YYYY-MM"
  @Input() editing = false;

  @Output() monthChange = new EventEmitter<string>();
  @Output() navigateMonth = new EventEmitter<number>();

  displayDate!: Date;

  ngOnChanges() {
    this.syncDisplayDate();
  }

  private syncDisplayDate() {
    if (!this.selectedMonthValue) return;

    const [year, month] = this.selectedMonthValue.split('-').map(Number);
    this.displayDate = new Date(year, month - 1, 1);
  }

  /* ===============================================
     HANDLERS FOR MATERIAL MONTH PICKER
     =============================================== */

  chosenYearHandler(normalizedYear: Date) {
    this.displayDate = new Date(
      normalizedYear.getFullYear(),
      this.displayDate.getMonth(),
      1
    );
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
    const y = normalizedMonth.getFullYear();
    const m = normalizedMonth.getMonth() + 1;

    const formatted = `${y}-${String(m).padStart(2, '0')}`;

    this.selectedMonthValue = formatted;
    this.syncDisplayDate();
    this.monthChange.emit(formatted);

    (datepicker as any)._currentView = 'year';

    datepicker.close();
  }

  navigate(amount: number) {
    this.navigateMonth.emit(amount);
  }
}
