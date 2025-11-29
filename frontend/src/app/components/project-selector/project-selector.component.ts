import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Project {
  name: string;
}

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.css']
})
export class ProjectSelectorComponent {

  @Input() projects: Project[] = [];
  @Input() selectedProject!: string;
  @Input() editing: boolean = false;
  @Output() projectChange = new EventEmitter<string>();

  onChange(value: string) {
    this.projectChange.emit(value);
  }
}
