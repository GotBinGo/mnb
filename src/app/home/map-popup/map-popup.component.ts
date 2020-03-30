import { Component, OnInit, Input } from '@angular/core';
import { SortablejsOptions } from 'ngx-sortablejs';

@Component({
  selector: 'app-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent implements OnInit {
  @Input() popup: any;
  scanned = true;
  normalList1 = [
    'p1',
    'p2',
    'p3',
  ];

  normalList2 = [
    'u1',
    'u2',
    'u3',
  ];

  normalOptions: SortablejsOptions = {
    group: 'normal-group',
  };
  constructor() {}

  ngOnInit( ) {
    this.scanned = true;
  }

  close() {
    this.popup.opened = false;
  }
}
