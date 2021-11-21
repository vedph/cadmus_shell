import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cadmus-close-save-buttons',
  templateUrl: './close-save-buttons.component.html',
  styleUrls: ['./close-save-buttons.component.css']
})
export class CloseSaveButtonsComponent {
  @Input()
  public form?: FormGroup;
  @Input()
  public noSave?: boolean;

  @Output()
  public closeRequest: EventEmitter<any>;

  constructor() {
    this.closeRequest = new EventEmitter();
  }

  public close(): void {
    this.closeRequest.emit();
  }
}
