import { Component, OnInit, Input } from '@angular/core';
import { SortablejsOptions } from 'ngx-sortablejs';
import { PopupService } from '@app/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  get popup(): any {
    return this.ps.popup;
  }
  normalList1 = ['p1', 'p2', 'p3'];

  normalList2 = ['u1', 'u2', 'u3'];

  normalOptions: SortablejsOptions = {
    group: 'normal-group'
  };
  constructor(private ps: PopupService) {}

  ngOnInit() {}

  close() {
    this.popup.opened = false;
  }
}
