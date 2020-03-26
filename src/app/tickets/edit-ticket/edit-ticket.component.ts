import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder, RxwebValidators } from '@rxweb/reactive-form-validators';
import { finalize } from 'rxjs/operators';
import { filter } from 'lodash';
import { TicketsClient, TicketDto, TicketType, TicketStatus, AccountClient } from '../../api/app.generated';
import { SelectListItem } from '../../shared/models/select-list';
import { CredentialsService } from '../../core/authentication/credentials.service';
import { SpinnerService } from '../../shared/loading-spinner/spinner.service';
import { CommonHelper } from '../../shared/common-helper';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.scss']
})
export class EditTicketComponent implements OnInit {
  public ticketId?: number;
  public ticketForm: FormGroup;
  public ticketTypes: SelectListItem[];
  public rooms: SelectListItem[] = [];
  public assignablePlaces: SelectListItem[] = [];
  public assignableUsers: SelectListItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: RxFormBuilder,
    private spinnerService: SpinnerService,
    private credentialsService: CredentialsService,
    private accountClient: AccountClient,
    private ticketsClient: TicketsClient
  ) {
    this.ticketTypes = [
      { label: 'Hardver', value: TicketType.Hardware },
      { label: 'Konyha', value: TicketType.Kitchen },
      { label: 'WC', value: TicketType.Toilet }
    ];
    this.rooms = CommonHelper.szobak;
    this.assignableUsers = [];
    this.assignablePlaces = [{ label: 'Recepció', value: 'Recepció (C1)' }, { label: 'IT', value: 'IT (C24)' }];
  }

  ngOnInit() {
    this.accountClient.getUsers().subscribe(result => {
      this.assignableUsers = result
        .filter(x => x.officeLocation && x.officeLocation[0] === 'C')
        .map(x => {
          return { label: x.name, value: x.email } as SelectListItem;
        });
    });

    this.ticketId = this.activatedRoute.snapshot.params.ticketId;
    this.ticketForm = this.fb.group({
      subject: ['', RxwebValidators.required({ message: 'A tárgy megadása kötelező' })],
      details: ['', RxwebValidators.required({ message: 'A megjegyzés megadása kötelező' })],
      type: ['', RxwebValidators.required({ message: 'A típus megadása kötelező' })],
      location: ['', RxwebValidators.required({ message: 'A hely megadása kötelező' })],
      assignedToUser: [false],
      assignedTo: ['', RxwebValidators.required({ message: 'A felelős megadása kötelező' })]
    });
    if (this.ticketId) {
      this.spinnerService.show();
      this.ticketsClient
        .getTicket(this.ticketId)
        .pipe(finalize(() => this.spinnerService.hide()))
        .subscribe(result => {
          Object.keys(result).forEach(name => {
            if (this.ticketForm.controls[name]) {
              this.ticketForm.controls[name].patchValue(result[name], { onlySelf: true });
            }
          });
        });
    }
    const roomL = this.activatedRoute.snapshot.queryParams['room'];
    if (roomL) {
      this.ticketForm.controls.location.setValue(roomL);
    }
  }

  assignedToUserChanged() {
    this.ticketForm.controls['assignedTo'].patchValue('', { onlySelf: true });
  }

  save() {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const ticket = new TicketDto({
      id: this.ticketId || 0,
      subject: this.ticketForm.value.subject,
      details: this.ticketForm.value.details,
      type: this.ticketForm.value.type,
      upvoteCount: 1,
      location: this.ticketForm.value.location,
      createdBy: this.credentialsService.credentials.email,
      assignedToUser: this.ticketForm.value.assignedToUser,
      assignedTo: this.ticketForm.value.assignedTo,
      status: TicketStatus.ToDo
    });
    const observable = this.ticketId ? this.ticketsClient.editTicket(ticket) : this.ticketsClient.addTicket(ticket);
    this.spinnerService.show();
    observable.pipe(finalize(() => this.spinnerService.hide())).subscribe(() => {
      this.router.navigate(['/tickets']);
    });
  }
}
