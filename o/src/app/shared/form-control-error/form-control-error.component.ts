import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-control-error',
  templateUrl: './form-control-error.component.html',
  styleUrls: ['./form-control-error.component.scss']
})
export class FormControlErrorComponent implements OnInit {
  @Input() control: AbstractControl;

  constructor() {}

  ngOnInit() {}

  get errors(): string[] {
    const serverErrors = (this.control.errors['serverErrors'] as string[]) || [];
    const e = this.control.errors;
    const clientErrors = Object.keys(this.control.errors)
      .filter((k: string) => e[k] && e[k].message)
      .map((k: string) => e[k].message);
    return serverErrors.concat(clientErrors);
  }
}
