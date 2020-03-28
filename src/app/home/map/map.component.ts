import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SearchService } from '@app/core/search/search.service';
import { IdleService } from '@app/core/idle.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  popup = { opened: false };
  sel = new ReplaySubject(1);
  targyalo = new ReplaySubject(9); // legyen több ha több a tárgyaló

  constructor(private searchService: SearchService, private idleService: IdleService) {}

  ngOnInit() {
    this.sel.next('C35');
    this.searchService.getRoomChangeObservable().subscribe(x => {});
    this.sel = this.searchService.getRoomChangeObservable() as any;
    this.idleService.getOnIdleSubject().subscribe(_ => this.searchService.updateRoom());
  }

  roomSelected(e: any) {
    this.searchService.updateRoom(e);
  }
}
