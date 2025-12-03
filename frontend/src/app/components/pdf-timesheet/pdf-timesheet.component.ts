import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-pdf-timesheet',
  templateUrl: './pdf-timesheet.component.html',
  styleUrls: ['./pdf-timesheet.component.css']
})
export class PdfTimesheetComponent {

  @ViewChild('pdfSheet') pdfSheet!: ElementRef;

  @Input() selectedMonth!: string;
  @Input() currentYear!: number;
  @Input() daysInMonth: number[] = [];
  @Input() timesheetData!: any;
  @Input() isWeekend!: (day: number) => boolean;
  @Input() isHoliday!: (day: number) => boolean;
  @Input() getTotalHours!: (hours: Record<number, number>) => number;

  downloadPdf(): void {
      if (!this.pdfSheet) return;

      const element = this.pdfSheet.nativeElement as HTMLElement;

      const opt = {
        margin:       [10, 10, 10, 10],
        filename:     `Timesheet-${this.selectedMonth}.pdf`,
        image:        { type: 'jpeg', quality: 3 },
        html2canvas:  {
          scale: 2,
          useCORS: true
        },
        jsPDF:        {
          unit: 'pt',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak:    {
          mode: ['css', 'legacy']
        }
      } as any;

      html2pdf().set(opt).from(element).save();
  }
}
