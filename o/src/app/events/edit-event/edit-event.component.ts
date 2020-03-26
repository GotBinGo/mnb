import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder, RxwebValidators } from '@rxweb/reactive-form-validators';
import { EventsClient, EventDto } from '../../api/app.generated';
import { SelectListItem } from '../../shared/models/select-list';
import { SpinnerService } from '../../shared/loading-spinner/spinner.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {
  public eventId?: number;
  public eventForm: FormGroup;
  public hours: SelectListItem[] = [];
  public minutes: SelectListItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: RxFormBuilder,
    private spinnerService: SpinnerService,
    private eventsClient: EventsClient
  ) {
    for (let i = 0; i < 24; i++) {
      this.hours.push({ label: `${i}`, value: i });
    }
    for (let i = 0; i < 60; i++) {
      this.minutes.push({ label: `${i}`, value: i });
    }
  }

  ngOnInit() {
    this.eventId = this.activatedRoute.snapshot.params.eventId;
    this.eventForm = this.fb.group({
      title: ['', RxwebValidators.required({ message: 'A név megadása kötelező' })],
      date: ['', RxwebValidators.required({ message: 'Az időpont megadása kötelező' })],
      hour: ['', RxwebValidators.required({ message: 'Az óra megadása kötelező' })],
      minute: ['', RxwebValidators.required({ message: 'A perc megadása kötelező' })],
      description: ['', RxwebValidators.required({ message: 'A leírás megadása kötelező' })]
    });
    if (this.eventId) {
      this.spinnerService.show();
      this.eventsClient
        .getEvent(this.eventId)
        .pipe(finalize(() => this.spinnerService.hide()))
        .subscribe(result => {
          Object.keys(result).forEach(name => {
            if (this.eventForm.controls[name]) {
              this.eventForm.controls[name].patchValue(result[name], { onlySelf: true });
              if (name === 'date') {
                this.eventForm.controls['hour'].patchValue(result.date.getHours(), { onlySelf: true });
                this.eventForm.controls['minute'].patchValue(result.date.getMinutes(), { onlySelf: true });
              }
            }
          });
        });
    }
  }

  save() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const event = new EventDto({
      id: this.eventId || 0,
      title: this.eventForm.value.title,
      date: this.eventForm.value.date,
      description: this.eventForm.value.description
    });
    event.date.setHours(this.eventForm.value.hour);
    event.date.setMinutes(this.eventForm.value.minute);
    const observable = this.eventId ? this.eventsClient.editEvent(event) : this.eventsClient.addEvent(event);
    this.spinnerService.show();
    observable.pipe(finalize(() => this.spinnerService.hide())).subscribe(() => {
      this.router.navigate(['/events']);
    });
  }
}
