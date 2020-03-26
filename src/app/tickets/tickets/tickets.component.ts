import { Component, OnInit } from '@angular/core';
import { TicketsClient, TicketDto, TicketType, UserDto, AccountClient, TicketStatus } from '../../api/app.generated';
import { ModalService } from '../../shared/modal/modal.service';
import { SelectListItem } from '../../shared/models/select-list';
import { SpinnerService } from '../../shared/loading-spinner/spinner.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  public ticketsToDo: TicketDto[] = [];
  public ticketsDoing: TicketDto[] = [];
  public ticketsDone: TicketDto[] = [];
  public ticketTypes: SelectListItem[];
  public users: UserDto[];

  constructor(
    private spinnerService: SpinnerService,
    private modalService: ModalService,
    private accountClient: AccountClient,
    private ticketsClient: TicketsClient
  ) {
    this.ticketTypes = [
      { label: 'Hardver', value: TicketType.Hardware },
      { label: 'Konyha', value: TicketType.Kitchen },
      { label: 'WC', value: TicketType.Toilet }
    ];
  }

  ngOnInit() {
    this.spinnerService.show();
    this.accountClient
      .getUsers()
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe(result => {
        this.users = result;
      });

    this.refreshTickets();
  }

  async deleteTicket(ticketId: number) {
    await this.modalService
      .confirm('Biztos törli a kiválaszott hibajegyet?', 'Törlés megerősítés')
      .afterClosed()
      .toPromise()
      .then(result => {
        if (result) {
          this.spinnerService.show();
          this.ticketsClient
            .deleteTicket(ticketId)
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe(() => {
              this.refreshTickets();
            });
        }
      });
  }

  upvoteTicket(ticketId: number) {
    this.spinnerService.show();
    this.ticketsClient
      .upvoteTicket(ticketId)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe(() => {
        this.refreshTickets();
      });
  }

  private refreshTickets() {
    this.spinnerService.show();
    this.ticketsClient
      .getTickets()
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe(result => {
        this.ticketsToDo = result.filter(t => t.status === TicketStatus.ToDo);
        this.ticketsDoing = result.filter(t => t.status === TicketStatus.Doing);
        this.ticketsDone = result.filter(t => t.status === TicketStatus.Done);
      });
  }
}
