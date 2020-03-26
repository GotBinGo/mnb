import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenuItem } from '../models/header-menu-item';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { Roles } from '@app/core/models/roles';
import { includes, some } from 'lodash';
import { AccountClient, UserDto } from '@app/api/app.generated';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SearchService } from '@app/core/search/search.service';
import { dummyProfile } from '@app/shared/dummy-profile-image';
import { runInThisContext } from 'vm';
import { NthClick } from '@app/shared/click-counter';
import { MatDialog } from '@angular/material';
import { DeveloperModalComponent } from '@app/shared/developer-modal/developer-modal.component';
import { IdleService } from '@app/core/idle.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidenav: any;
  nthClick = new NthClick(9);

  menuHidden = true;
  profilImage: string;

  menuItems: HeaderMenuItem[] = [
    {
      title: 'Térkép',
      link: '/',
      disabled: false,
      hideInKiosk: false
    },
    {
      title: 'Guideline',
      children: [
        { title: 'Matrix', link: '/guideline/matrix' },
        { title: 'List', link: '/guideline/list' },
        { title: 'Details', link: '/guideline/details' }
      ],
      disabled: true
    }
  ];

  users: UserDto[] = [];
  searchModel = '';

  isKiosk: boolean;
  date = new Date();

  constructor(
    private router: Router,
    private accountClient: AccountClient,
    private credentialsService: CredentialsService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private idleService: IdleService
  ) {}

  formatter = (result: UserDto) => (result ? result.name + ' (' + (result.officeLocation || '') + ')' : '');
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term: string) =>
        term.length < 2
          ? []
          : this.users.filter(v => (v.name + (v.officeLocation || '')).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      )
    );

  get name() {
    return 'ISMERETLEN';
  }

  ngOnInit() {
    this.profilImage = dummyProfile;
    // this.credentialsService.getUsers().subscribe(x => (this.users = x));
    this.users = [];
    this.isKiosk = this.credentialsService.isKiosk;
    if (this.isKiosk) {
      this.menuItems = this.menuItems.filter(x => !x.hideInKiosk);
    }

    setInterval(() => (this.date = new Date()), 10_000);
    this.idleService.getOnIdleSubject().subscribe(_ => (this.searchModel = ''));
  }

  onSelect(event: { item: UserDto }) {
    setTimeout(() => {
      this.searchModel = '';
      this.menuHidden = true;
      this.router.navigate(['']);
    });
    if (event.item && event.item.officeLocation) {
      this.searchService.updateRoom(event.item.officeLocation);
    }
  }

  onProfileClick() {
    // this.searchService.updateRoom(this.credentialsService.credentials.officeLocation);
    this.router.navigate(['']);
    this.menuHidden = true;
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  async logout() {
    await this.accountClient.logout().toPromise();
    this.credentialsService.logout();
    this.router.navigateByUrl('/login');
  }

  notInRole(roles: string[]) {
    return false; //!this.credentialsService.isAuthenticated || !some(roles, x => includes(this.credentialsService.credentials.roles, x));
  }

  add() {
    if ((this.searchService.getSelectedRoomName() === 'WCCD' || this.searchModel === 'matador') && this.nthClick.click()) {
      this.searchService.updateRoom();
      this.searchModel = '';
      this.openDev();
    }
  }

  openDev() {
    this.dialog.open(DeveloperModalComponent, { minWidth: '60vw', maxWidth: '60vw', autoFocus: false });
  }
}
