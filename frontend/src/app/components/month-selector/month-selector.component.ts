import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.css']
})
export class MonthSelectorComponent {

  /** Current month value — formatted like "2025-11" */
  @Input() selectedMonthValue!: string;

  /** True when editing is active (month navigation disabled) */
  @Input() editing: boolean = false;

  /** Emits when month changes */
  @Output() monthChange = new EventEmitter<string>();

  /** Emits when navigating (-1 previous, +1 next) */
  @Output() navigateMonth = new EventEmitter<number>();

  /** Called when input <input type="month"> changes */
  onMonthInputChange(value: string) {
    this.monthChange.emit(value);
  }

  /** Called when ‹ › buttons are pressed */
  navigate(amount: number) {
    this.navigateMonth.emit(amount);
  }
}
