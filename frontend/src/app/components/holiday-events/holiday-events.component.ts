import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-holiday-events',
  templateUrl: './holiday-events.component.html',
  styleUrls: ['./holiday-events.component.css']
})
export class HolidayEventsComponent {

  /** The formatted holiday list for this month */
  @Input() holidays: { date: string; name: string }[] = [];
}
