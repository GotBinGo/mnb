import { Component, OnInit, OnDestroy } from '@angular/core';
import { SystemClient, AccountClient } from '@app/api/app.generated';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { CredentialsService } from '../../core/authentication/credentials.service';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { SearchService } from '@app/core/search/search.service';
import { RoomHelper } from '../helpers/room.helper';
import { IdleService } from '@app/core/idle.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  popup = { opened: false };

  version: string;
  model: any = null;

  sel = new ReplaySubject(1);

  targyalo = new ReplaySubject(9); // legyen több ha több a tárgyaló
  cUsers = new ReplaySubject(1);

  rooms: any;
  hasSelected = false;

  roomRefreshInterval: number = null;

  constructor(
    private systemClient: SystemClient,
    private http: HttpClient,
    private credentialsService: CredentialsService,
    private searchService: SearchService,
    private accountClient: AccountClient,
    private idleService: IdleService
  ) {}
  ngOnInit() {
    // setInterval(() => {
    //   this.sel.subscribe((y: string) => {
    //     console.log(this.rooms.map((x: any) => x.roomEmail).filter((x: any) => x.includes(getIrodaLabel(y).toLowerCase())));
    //   });
    // }, 100);

    // this.accountClient.reserveRoom('tardis@autsoft.hu', new Date(), 30).subscribe(x => {});
    // this.systemClient.getVersion().subscribe(x => (this.version = x));
    // this.credentialsService.getUsers().subscribe(x => {
    //   this.cUsers.next(x.filter(y => y.officeLocation && y.officeLocation[0] === 'C'));
    // });
    this.cUsers.next([]);
    this.sel.next('C35');

    // this.updateRooms();

    this.searchService.getRoomChangeObservable().subscribe(x => (this.hasSelected = !!x));
    this.sel = this.searchService.getRoomChangeObservable() as any;

    // this.roomRefreshInterval = setInterval(t => {
    //   this.updateRooms();
    // }, 30_000) as any;

    this.idleService.getOnIdleSubject().subscribe(_ => this.searchService.updateRoom());
  }

  ngOnDestroy(): void {
    if (this.roomRefreshInterval != null) {
      clearInterval(this.roomRefreshInterval);
    }
  }

  updateRooms() {
    // this.accountClient.getRooms().subscribe(y => {
    //   this.rooms = y;
    //   const data = y.map(x => RoomHelper.parseRoomScheduleInfo(x));
    //   data.forEach(x => this.targyalo.next(x));
    // });
  }

  roomSelected(e: any) {
    this.searchService.updateRoom(e);
    this.hasSelected = true;
  }

  closeRoomView() {
    this.searchService.updateRoom();
    this.hasSelected = false;
  }
}
