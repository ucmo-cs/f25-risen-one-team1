// src/app/home/home.component.ts
import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ProjectService, Project } from '../services/project.service';
import { TimesheetService } from '../services/timesheet.service';
import { HolidayService } from '../services/holiday.service';
import { SavingService } from '../services/saving.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-form',
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  selectedMonth: string = 'Please select a month';
  selectedMonthValue: string = '';
  daysInMonth: number[] = [];
  showPrintLayout = false;

  projectName: string = 'Project 1';
  selectedProject: string = '';
  projects: Project[] = [];
  timesheetData = { projectName: '', timeframe: '', employees: [] as any[] };

  currentYear = new Date().getFullYear();

  countryCode: string = 'US';
  holidayByDay = new Map<number, string>();

  editing = false;
  editingTimesheet = { projectName: '', timeframe: '', employees: [] as any[] };

  private timesheetCache = new Map<string, any[]>();

  private fallbackProjects: Project[] = [{ id: '', name: '(Project)' }];

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private timesheetService: TimesheetService,
    private holidayService: HolidayService,
    private savingService: SavingService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.setInitialMonth();
    this.generateDaysForMonth();
    this.loadTimesheetData();
    this.loadHolidays();
  }

  ngAfterViewInit(): void {
    document.querySelector('.current-day')?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') this.changeMonth(-1);
    if (e.key === 'ArrowRight') this.changeMonth(1);
  }

  // ------------------------------------------------------------
  // PROJECTS
  // ------------------------------------------------------------
  private loadProjects(): void {
    this.projects = this.fallbackProjects;

    this.projectService.getProjects().subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.projects = data;
          this.selectedProject = this.projectName = data[0].name;
        }
      },
      error: (err) => console.error('Failed to load projects:', err)
    });
  }

  // ------------------------------------------------------------
  // MONTH SETUP
  // ------------------------------------------------------------
  private setInitialMonth(): void {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    this.selectedMonthValue = `${year}-${month}`;
    this.selectedMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  private generateDaysForMonth(): void {
    const [year, month] = this.selectedMonthValue.split('-').map(Number);
    const numDays = new Date(year, month, 0).getDate();
    this.daysInMonth = Array.from({ length: numDays }, (_, i) => i + 1);
  }

  loadTimesheetData(): void {
    if (!this.selectedMonthValue) return;

    const [year, month] = this.selectedMonthValue.split('-').map(Number);
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

    const timeframe = `${monthName}_${year}`;
    const projectName = this.selectedProject || this.projectName;

    const cacheKey = `${projectName}:${timeframe}`;

    this.timesheetData.projectName = projectName;
    this.timesheetData.timeframe = timeframe;
    this.generateDaysForMonth();

    if (this.timesheetCache.has(cacheKey)) {
      this.timesheetData.employees = JSON.parse(
        JSON.stringify(this.timesheetCache.get(cacheKey))
      );
    } else {
      for (const emp of this.timesheetData.employees) {
        emp.hours = emp.hours || {};
        for (const day of this.daysInMonth) {
          emp.hours[day] = 0;
        }
      }
    }

    this.timesheetService.getTimesheet(projectName, timeframe).subscribe({
      next: (data) => {
        const newEmpData = data?.employees ?? [];

        // ⭐ Cache it
        this.timesheetCache.set(cacheKey, newEmpData);
        this.timesheetData.employees = JSON.parse(JSON.stringify(newEmpData));
      },

      error: (err) => console.error('Error fetching timesheet:', err)
    });
  }


  // ------------------------------------------------------------
  // HOLIDAYS
  // ------------------------------------------------------------
  private loadHolidays(): void {
    const [year, month] = this.selectedMonthValue.split('-').map(Number);
    this.holidayByDay.clear();

    this.holidayService.getPublicHolidays(year, this.countryCode).subscribe({
      next: (list) => {
        list.forEach(h => {
          const [y, m, d] = h.date.split('-').map(Number);
          if (y === year && m === month) this.holidayByDay.set(d, h.name || h.localName);
        });
      },
      error: () => this.holidayByDay.clear()
    });
  }

  // ------------------------------------------------------------
  // EVENTS
  // ------------------------------------------------------------
  onMonthChange(): void {
    if (!this.selectedMonthValue) return;

    const [year, month] = this.selectedMonthValue.split('-').map(Number);
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    this.selectedMonth = `${monthName} ${year}`;

    this.generateDaysForMonth();
    this.loadTimesheetData();
    this.loadHolidays();
  }

  onProjectChange(): void {
    this.projectName = this.selectedProject;
    this.loadTimesheetData();
  }

  changeMonth(offset: number): void {
    if (!this.selectedMonthValue) return;

    const [year, month] = this.selectedMonthValue.split('-').map(Number);
    const d = new Date(year, month - 1, 1);

    d.setMonth(d.getMonth() + offset);

    const newMonth = String(d.getMonth() + 1).padStart(2, '0');
    const newYear = d.getFullYear();

    this.selectedMonthValue = `${newYear}-${newMonth}`;
    this.onMonthChange();
  }

  signIn(): void {
    this.router.navigate(['/login']);
  }

  // ------------------------------------------------------------
  // UTILITIES
  // ------------------------------------------------------------
  trackByEmployee(index: number, employee: any) {
    return employee.id ?? employee.name ?? index;
  }

  getTotalHours(hours: Record<number, number> | undefined): number {
    return hours ? Object.values(hours).reduce((a, b) => a + b, 0) : 0;
  }

  isHoliday(day: number): boolean {
    return this.holidayByDay.has(day);
  }

  getHolidayName(day: number): string | null {
    return this.holidayByDay.get(day) ?? null;
  }

  get formattedHolidays(): { date: string; name: string }[] {
    const [year, month] = this.selectedMonthValue.split('-');
    const monthName = new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'short' });

    return Array.from(this.holidayByDay.entries())
      .sort(([a], [b]) => a - b)
      .map(([day, name]) => ({ date: `${monthName} ${day}`, name }));
  }

  isWeekend(day: number): boolean {
    const [y, m] = this.selectedMonthValue.split('-').map(Number);
    const dow = new Date(y, m - 1, day).getDay();
    return dow === 0 || dow === 6;
  }

  getDowLabel(day: number): string {
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

  getGrandTotal() {
    return this.timesheetData.employees
      .reduce((sum, e) => sum + this.getTotalHours(e.hours), 0);
  }

  // ------------------------------------------------------------
  // EDIT / SAVE
  // ------------------------------------------------------------
  editTimesheet(): void {
    this.editingTimesheet = JSON.parse(JSON.stringify(this.timesheetData));
    this.editing = !this.editing;
  }

  saveTimesheet(): void {
    if (!this.editing) return;

    // Clean input
    for (const emp of this.editingTimesheet.employees) {
      for (const day of this.daysInMonth) {
        const val = Number(emp.hours[day]);
        emp.hours[day] = isNaN(val) ? 0 : val;
      }
    }

    this.savingService.saveProject(
      this.timesheetData.timeframe,
      this.editingTimesheet.employees,
      this.timesheetData.projectName
    ).subscribe({
      next: (success) => {
        if (success) {
          this.timesheetData = JSON.parse(JSON.stringify(this.editingTimesheet));
          this.editing = false;
        } else {
          console.error('Failed to save timesheet');
        }
      },
      error: (error) => console.error('Error saving timesheet', error)
    });
  }

  exportToPDF(orientation: "portrait" | "landscape") {
    const element = document.getElementById("pdf-export-container");
    if (!element) return;

    element.style.display = "block"; // temporarily show for rendering

    const pdf = new jsPDF({
      orientation: orientation,
      unit: "pt",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    html2canvas(element, {
      scale: 3, // high resolution
      useCORS: true,
      scrollY: 0
    }).then(canvas => {

      const imgData = canvas.toDataURL("image/png");

      // Auto scale to fit A4 page exactly
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const ratio = Math.min(
        pageWidth / canvasWidth,
        pageHeight / canvasHeight
      );

      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;

      const x = (pageWidth - imgWidth) / 2;
      const y = 20;

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

      pdf.save(`Timesheet_${this.selectedMonth}_${orientation}.pdf`);

      element.style.display = "none";
    });
  }
}
