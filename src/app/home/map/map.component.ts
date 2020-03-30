import { Component, OnInit, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SearchService } from '@app/core/search/search.service';
import { IdleService } from '@app/core/idle.service';
import { PopupService } from '@app/popup.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  get popup(): any {
    return this.ps.popup;
  }
  sel = new ReplaySubject(1);
  targyalo = new ReplaySubject(9); // legyen több ha több a tárgyaló

  constructor(private searchService: SearchService, private idleService: IdleService, private ps: PopupService) {}

  ngOnInit() {
    this.sel.next('C35');
    this.searchService.getRoomChangeObservable().subscribe(x => {});
    this.sel = this.searchService.getRoomChangeObservable() as any;
    this.idleService.getOnIdleSubject().subscribe(_ => this.searchService.updateRoom());
  }

  roomSelected(e: any) {
    console.log(e);
    if (e === 'Plane.005') {
      this.popup.opened = true;
      this.popup.room = e;
    }
    if (e === 'Plane.039') {
      this.popup.opened = true;
      this.popup.room = e;
    }
    this.searchService.updateRoom(e);
  }
}
