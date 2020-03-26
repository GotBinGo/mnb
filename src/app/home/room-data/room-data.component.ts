import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Observable, zip, combineLatest } from 'rxjs';
import { startsWith } from 'lodash';
import { AccountClient, UserStatus, UserDto } from '../../api/app.generated';
import { getIrodaLabel, getIrodaCode, isRoomReservable, getRoomFullName } from '@app/shared/three-view/iroda-labels';
import { dummyProfile } from '@app/shared/dummy-profile-image.ts';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@app/shared/modal/modal.service';
import { MatDialog } from '@angular/material';
import { ReserveRoomComponent } from '../reserve-room/reserve-room.component';
import { CredentialsService } from '../../core/authentication/credentials.service';
import { RoomHelper } from '../helpers/room.helper';
import { SearchService } from '@app/core/search/search.service';

const UserStatusNames = new Map<UserStatus, string>([
  [UserStatus.Available, 'Available'],
  [UserStatus.AvailableOutOfOffice, 'Available, Out Of Offica'],
  [UserStatus.Busy, 'Busy'],
  [UserStatus.InAMeeting, 'In A Meeting'],
  [UserStatus.DoNotDisturb, 'Do Not Disturb'],
  [UserStatus.Away, 'Away'],
  [UserStatus.Offline, 'Offline'],
  [UserStatus.StatusUnknown, 'Status Unknown'],
  [UserStatus.OutOfOffice, 'Out Of Office'],
  [UserStatus.BeRightBack, 'Be Right Back']
]);

@Component({
  selector: 'app-room-data',
  templateUrl: './room-data.component.html',
  styleUrls: ['./room-data.component.scss']
})
export class RoomDataComponent implements OnInit {
  @Input() room: Observable<string>;
  @Input() rooms: any[];
  @Input() cUsers: Observable<UserDto[]>;

  @Output() close = new EventEmitter();
  @ViewChild('usersScroll', { static: false }) usersScroll: ElementRef;

  currentTime = new Date();

  json = JSON.stringify;

  localRoom: string;
  localUsers: any;
  localReservations: any;

  get roomLabel() {
    if (!this.localRoom) {
      return;
    }

    return `${getRoomFullName(this.localRoom)}`;
  }

  dummyProfile = dummyProfile;

  isKiosk: boolean;

  constructor(
    private router: Router,
    private modalService: ModalService,
    private dialog: MatDialog,
    private accountClient: AccountClient,
    private toast: ToastrService,
    private credentialsService: CredentialsService,
    private searchService: SearchService
  ) {}

  isRoomCurrentlyReserved() {
    if (!this.localRoom || !this.localReservations.schedules) {
      return false;
    }

    return this.localReservations.schedules.length !== 0 && this.localReservations.schedules[0].start < this.currentTime;
  }

  getSelectedRoomInfo([room, users]: [string, any]) {
    this.localReservations = null;
    // this.accountClient.getRooms().subscribe(y => {
    //   this.rooms = y;
    //   const data = y.map(x => RoomHelper.parseRoomScheduleInfo(x));

    //   const r = data.filter(x => x.id === this.localRoom);
    //   if (r) {
    //     this.localReservations = r[0];
    //   }
    // });

    if (this.localRoom !== room) {
      this.scrollToTop();
    }

    this.localRoom = room;
    this.localUsers = users.filter((x: any) => x.officeLocation === room);
    this.localUsers = this.localUsers.map((x: any) => {
      this.accountClient.getUserByEmail(x.email).subscribe(p => {
        x.picture = p.picture;
      });

      this.accountClient.getUserStatus(x.email).subscribe(a => {
        x.availability = a;
      });

      return x;
    });
  }

  addTicket(room: string) {
    if (room) {
      this.router.navigate(['/tickets/add'], { queryParams: { room }, replaceUrl: true });
    }
  }

  isReserveRoomButtonVisible(room: string) {
    return isRoomReservable(room);
  }

  async reserveRoom(room: string) {
    if (room) {
      const dialogRef = this.dialog.open(ReserveRoomComponent, { minWidth: '45vw', maxWidth: '90vw', disableClose: true });
      dialogRef.componentInstance.title = `${getRoomFullName(room)} foglalása`;
      await dialogRef
        .afterClosed()
        .toPromise()
        .then(result => {
          if (!result) {
            return;
          }
          const email = this.rooms.map((x: any) => x.roomEmail).filter((x: any) => x.includes(getIrodaLabel(room).toLowerCase()));
          if (email.length) {
            this.accountClient.reserveRoom(email[0], result.startDate, result.interval).subscribe(x => {
              this.toast.success(`${getRoomFullName(room)} foglalás kezdeményezve!`);
            });
          }
        });
    }
  }

  ngOnInit() {
    combineLatest([this.room, this.cUsers]).subscribe(x => this.getSelectedRoomInfo(x));
    this.isKiosk = this.credentialsService.isKiosk;
  }

  navToUser(userName: string) {
    // TODO itt a subscribe nem olyan jó.
    this.cUsers.subscribe(users => {
      const user = users.filter(x => x.name === userName.trim());
      if (user.length) {
        this.searchService.updateRoom(user[0].officeLocation);
      }
    });
  }

  getUserEmailHref(user: any) {
    return this.isKiosk ? '#' : `mailTo:${user.email}`;
  }

  getStatus(availability: number): string {
    switch (availability) {
      case UserStatus.Available: {
        return 'fas fa-circle status-green';
      }
      case UserStatus.AvailableOutOfOffice: {
        return 'far fa-check-circle status-green';
      }
      case UserStatus.Away:
      case UserStatus.BeRightBack: {
        return 'fas fa-clock status-yellow';
      }
      case UserStatus.OutOfOffice: {
        return 'far fa-arrow-alt-circle-left status-purple';
      }
      case UserStatus.Busy:
      case UserStatus.InAMeeting: {
        return 'fas fa-circle status-red';
      }
      case UserStatus.DoNotDisturb: {
        return 'fas fa-minus-circle status-red';
      }
      case UserStatus.Offline: {
        return 'fas fa-times-circle status-grey';
      }
      case UserStatus.StatusUnknown:
      default: {
        return 'far fa-circle status-grey';
      }
    }
  }

  getStatusTitle(availability: number): string {
    return UserStatusNames.get(availability);
  }

  scrollToTop() {
    if (this.usersScroll) {
      this.usersScroll.nativeElement.scrollTop = 0;
    }
  }
}
