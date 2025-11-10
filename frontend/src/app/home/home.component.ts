// src/app/home/home.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ProjectService, Project } from '../services/project.service';
import { TimesheetService } from '../services/timesheet.service';
import { HolidayService, PublicHoliday } from '../services/holiday.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-form',
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // ====== Display Variables ======
  selectedMonth: string = 'Please select a month';  // text for heading
  selectedMonthValue: string = '';                  // raw input month value
  daysInMonth: number[] = [];                       // array of days for the selected month

  // ====== Project / Timesheet Variables ======
  projectName: string = 'Project 2';                // default project (for now)
  selectedProject: string = '';                     // value selected from dropdown
  projects: Project[] = [];                         // populated project list
  timesheetData: { projectName: string; timeframe: string; employees: any[] } = {
    projectName: '',
    timeframe: '',
    employees: []
  };                        // holds API results for employees/hours

  countryCode: string = 'US';
  holidayByDay = new Map<number, string>();

  weeks: number[][] = [];
  showPrintLayout = false;   // controls rendering the print layout

  // fallback if no projects are available
  private fallbackProjects: Project[] = [
    { id: '', name: '(Project)' }
  ];

  // ====== Constructor ======
  constructor(
    private router: Router,
    private projectService: ProjectService,
    private timesheetService: TimesheetService,
    private holidayService: HolidayService
  ) {}

  // ====== Lifecycle: ngOnInit ======
  ngOnInit(): void {
    // Initialize projects list (fetch from API or use fallback)
    this.projects = this.fallbackProjects;
    this.projectService.getProjects().subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.projects = data;

                this.selectedProject = this.projects[0].name;
                this.projectName = this.selectedProject;
        } else {
          this.projects = this.fallbackProjects;
        }
      },
      error: (err) => {
        console.error('Failed to load projects in HomeComponent', err);
        this.projects = this.fallbackProjects;
      }
    });

    // Get current date and set default selected month
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    this.selectedMonthValue = `${year}-${month}`;
    this.selectedMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Generate initial days and load data
    this.generateDays(year, Number(month));
    this.loadTimesheetData();
    this.loadHolidays(Number(year), Number(month));
  }

  // ====== Navigation ======
  signIn(): void {
    this.router.navigate(['/login']);
  }

  // ====== When Month Changes ======
  onMonthChange(): void {
    if (!this.selectedMonthValue) return;

    const [year, month] = this.selectedMonthValue.split('-');
    const monthIndex = Number(month) - 1;

    // Format display text like "October 2025"
    const monthName = new Date(Number(year), monthIndex, 1)
      .toLocaleString('default', { month: 'long' });
    this.selectedMonth = `${monthName} ${year}`;

    // Regenerate days for new month and refresh timesheet
    this.generateDays(year, Number(month));
    this.loadTimesheetData();
    this.loadHolidays(Number(year), Number(month));
  }

  // ====== When Project Changes ======
  onProjectChange(): void {
    console.log('Selected project:', this.selectedProject);
    this.projectName = this.selectedProject;
    this.loadTimesheetData();
  }

  // Jump months by offset: -1 = previous month, +1 = next month
  changeMonth(offset: number): void {
    if (!this.selectedMonthValue) return;

    // Parse current YYYY-MM
    const [y, m] = this.selectedMonthValue.split('-').map(Number);
    const d = new Date(y, m - 1, 1);

    // Move by offset months
    d.setMonth(d.getMonth() + offset);

    // Rebuild YYYY-MM and reuse your existing logic
    const newMonth = String(d.getMonth() + 1).padStart(2, '0');
    const newYear = d.getFullYear();
    this.selectedMonthValue = `${newYear}-${newMonth}`;
    this.onMonthChange();  // regenerates days, reloads data, reloads holidays
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') this.changeMonth(-1);
    if (e.key === 'ArrowRight') this.changeMonth(1);
  }
  ngAfterViewInit(): void {
    const todayCell = document.querySelector('.current-day');
    todayCell?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }

  // src/app/home/home.component.ts  (only the method below changes)
  loadTimesheetData(): void {
    if (!this.selectedMonthValue) return;

    const [year, month] = this.selectedMonthValue.split('-');

    const timeframe = `${new Date(Number(year), Number(month) - 1)
      .toLocaleString('default', { month: 'long' })}_${year}`;

    const projectName = this.selectedProject || this.projectName;

    console.log('Fetching timesheet for:', projectName, timeframe);

    // ✅ Always clear before loading (prevents stale UI)
    this.timesheetData = { projectName, timeframe, employees: [] };

    this.timesheetService.getTimesheet(projectName, timeframe).subscribe({
      next: (data) => {
        console.log('Received timesheet response:', data);

        // ✅ If data contains employees → use it
        if (data && data.employees) {
          this.timesheetData = data;
        } else {
          // ✅ Otherwise reset to an empty result
          this.timesheetData = { projectName, timeframe, employees: [] };
        }

        // ✅ Always regenerate days so UI re-renders header correctly
        this.generateDays(year, Number(month));
      },
      error: (err) => {
        console.error('Error fetching timesheet:', err);

        // ✅ Ensure table clears on error
        this.timesheetData = { projectName, timeframe, employees: [] };
      }
    });
  }


  // ====== Utility: Generate Days for Selected Month ======
  private generateDays(year: string | number, month: number): void {
    const numDays = new Date(Number(year), month, 0).getDate();
    this.daysInMonth = Array.from({ length: numDays }, (_, i) => i + 1);
  }
  // Calculates total hours for an employee
  getTotalHours(hours: Record<number, number> | undefined): number {
    if (!hours) return 0;
    return Object.values(hours).reduce((a, b) => a + b, 0);
  }

  private loadHolidays(year: number, month: number): void {
    this.holidayByDay.clear();
    this.holidayService.getPublicHolidays(year, this.countryCode).subscribe({
      next: (list) => {
        list.forEach(h => {
          const [y, m, d] = h.date.split('-').map(Number);
          if (y === year && m === month) {
            this.holidayByDay.set(d, h.name || h.localName);
          }
        });
      },
      error: () => {
        // silent fail or toast—your call
        this.holidayByDay.clear();
      }
    });
  }

  isHoliday(day: number): boolean {
    return this.holidayByDay.has(day);
  }

  getHolidayName(day: number): string | null {
    return this.holidayByDay.get(day) ?? null;
  }

  get formattedHolidays(): { date: string; name: string }[] {
    const [year, month] = this.selectedMonthValue.split('-');
    const monthName = new Date(Number(year), Number(month) - 1, 1)
      .toLocaleString('default', { month: 'short' });

    // Convert the Map into a sorted array
    const holidays = Array.from(this.holidayByDay.entries())
      .sort((a, b) => a[0] - b[0]) // sort by day
      .map(([day, name]) => ({
        date: `${monthName} ${day}`, // e.g. "Nov 27"
        name,
      }));
    return holidays;
  }

  // Is a given day (1..31) a weekend in the selected month?
  isWeekend(day: number): boolean {
    if (!this.selectedMonthValue) return false;
    const [y, m] = this.selectedMonthValue.split('-').map(Number);
    const dow = new Date(y, m - 1, day).getDay(); // 0=Sun ... 6=Sat
    return dow === 0 || dow === 6;
  }

  // Short day-of-week label for headers (Sun, Mon, ...)
  getDowLabel(day: number): string {
    if (!this.selectedMonthValue) return '';
    const [y, m] = this.selectedMonthValue.split('-').map(Number);
    return new Date(y, m - 1, day).toLocaleString('default', { weekday: 'short' });
  }

  isToday(day: number): boolean {
    const today = new Date();
    const [year, month] = this.selectedMonthValue.split('-').map(Number);
    return today.getDate() === day &&
      today.getMonth() + 1 === month &&
      today.getFullYear() === year;
  }
}
