import { Component, OnInit, Input } from '@angular/core';
import { Observable, zip, combineLatest } from 'rxjs';
import { AccountClient } from '../../api/app.generated';
import { getIrodaLabel } from '@app/shared/three-view/iroda-labels';

@Component({
  selector: 'app-room-data',
  templateUrl: './room-data.component.html',
  styleUrls: ['./room-data.component.scss']
})
export class RoomDataComponent implements OnInit {
  @Input() room: Observable<string>;
  @Input() cUsers: Observable<any[]>;

  json = JSON.stringify;

  localRoom: string;
  localUsers: any;

  get roomLabel() {
    return getIrodaLabel(this.localRoom);
  }

  constructor(private accountClient: AccountClient) {}

  doIt([room, users]: [string, any]) {
    this.localRoom = room;
    this.localUsers = users.filter((x: any) => x.officeLocation === room);
    this.localUsers = this.localUsers.map((x: any) => {
      this.accountClient.getUserByEmail(x.email).subscribe(p => {
        x.picture = p.picture;
      });

      return x;
    });
  }

  ngOnInit() {
    combineLatest([this.room, this.cUsers]).subscribe(x => this.doIt(x));
  }
}
