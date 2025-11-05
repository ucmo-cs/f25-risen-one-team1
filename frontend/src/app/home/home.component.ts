// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ProjectService, Project } from '../services/project.service';
import { TimesheetService } from '../services/timesheet.service';

@Component({
  selector: 'app-form',
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // fixed from "styleUrl" → correct key name
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

  // fallback if no projects are available
  private fallbackProjects: Project[] = [
    { id: '', name: '(Project)' }
  ];

  // ====== Constructor ======
  constructor(
    private router: Router,
    private projectService: ProjectService,
    private timesheetService: TimesheetService
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
  }

  // ====== When Project Changes ======
  onProjectChange(): void {
    console.log('Selected project:', this.selectedProject);
    this.projectName = this.selectedProject;
    this.loadTimesheetData();
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

}
