import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-signature-section',
  templateUrl: './signature-section.component.html',
  styleUrls: ['./signature-section.component.css']
})
export class SignatureSectionComponent {

  @Input() showEmployee: boolean = false;
  @Input() managerLabel: string = 'Manager Signature';
  @Input() employeeLabel: string = 'Employee Signature';
  @Input() showDate: boolean = true;
  @Input() pdfMode: boolean = false;
}
