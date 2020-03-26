import { Component, OnInit } from '@angular/core';
import { EventsClient, EventDto } from '../../api/app.generated';
import { ModalService } from '../../shared/modal/modal.service';
import { SpinnerService } from '../../shared/loading-spinner/spinner.service';
import { finalize } from 'rxjs/operators';
import { environment } from '@env/environment';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  public events: (EventDto & { icon?: string; color?: string; finished: boolean })[];
  public today: Date = new Date();

  constructor(private spinnerService: SpinnerService, private modalService: ModalService, private eventsClient: EventsClient) {}

  ngOnInit() {
    this.refreshEvents();
  }

  getEventCategory(categories: string[]): { icon?: string; color?: string; labels: string[] } {
    if (environment.event && environment.event.categories) {
      for (const category of environment.event.categories) {
        const intersect = category.labels.filter(tag => categories.indexOf(tag) !== -1);

        if (intersect.length !== 0) {
          return category;
        }
      }
    }

    return undefined;
  }

  private refreshEvents() {
    this.spinnerService.show();
    this.eventsClient
      .getEvents()
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe(result => {
        this.events = result as any;

        this.events.forEach(event => {
          const eventCategory = this.getEventCategory(event.categories);
          if (!!eventCategory) {
            event.icon = eventCategory.icon;
            event.color = eventCategory.color;
          }
          event.finished = event.endDate < this.today;
        });
      });
  }
}
