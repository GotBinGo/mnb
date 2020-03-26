import { Component, OnInit } from '@angular/core';
import { EventsClient, EventDto } from '../../api/app.generated';
import { ModalService } from '../../shared/modal/modal.service';
import { SpinnerService } from '../../shared/loading-spinner/spinner.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  public events: EventDto[];

  constructor(private spinnerService: SpinnerService, private modalService: ModalService, private eventsClient: EventsClient) {}

  ngOnInit() {
    this.refreshEvents();
  }

  async deleteEvent(eventId: number) {
    await this.modalService
      .confirm('Biztos törli a kiválaszott eseményt?', 'Törlés megerősítés')
      .afterClosed()
      .toPromise()
      .then(result => {
        if (result) {
          this.spinnerService.show();
          this.eventsClient
            .deleteEvent(eventId)
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe(() => {
              this.refreshEvents();
            });
        }
      });
  }

  private refreshEvents() {
    this.spinnerService.show();
    this.eventsClient
      .getEvents()
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe(result => {
        this.events = result;
      });
  }
}
