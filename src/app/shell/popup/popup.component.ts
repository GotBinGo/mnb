import { Component, OnInit, Input } from '@angular/core';
import { SortablejsOptions } from 'ngx-sortablejs';
import { PopupService } from '@app/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  scanned = false;
  last = false;
  scale = 0;
  get popup(): any {
    // if (this.ps.popup.opened) {
    //   setTimeout((x: any) => {
    //     if (document.getElementById('qr')) {
    //       document.getElementById('qr').style.transform = 'scale(1)';
    //     }
    //   }, 100);
    // } else {
    //   setTimeout((x: any) => {
    //     this.scanned = false;
    //   }, 100);
    //   if (document.getElementById('qr')) {
    //     document.getElementById('qr').style.transform = 'scale(0)';
    //   }
    // }

    if (!this.last && this.ps.popup.opened) { // nyit
      console.log('nyit');

      setTimeout((x: any) => {
        this.scale = 1;
      }, 100);
    }

    if (this.last && !this.ps.popup.opened) { // csuk
      console.log('csuk');
      setTimeout((x: any) => {
        this.scale = 0;
        this.scanned = false;
      }, 1);
    }

    this.last = this.ps.popup.opened;
    return this.ps.popup;
  }
  normalList1 = ['p3'];
  normalList2 = ['u2', 'p2'];

  normalOptions: SortablejsOptions = {
    group: 'normal-group'
  };
  constructor(private ps: PopupService) {}

  ngOnInit() {
  }

  close() {
    this.popup.opened = false;
    this.normalList1 = ['p3'];
    this.normalList2 = ['u2', 'p2'];
  }
}
