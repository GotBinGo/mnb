import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenuItem } from '../models/header-menu-item';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { Roles } from '@app/core/models/roles';
import { includes } from 'lodash';
import { AccountClient } from '@app/api/app.generated';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  profilImage: string;

  menuItems: HeaderMenuItem[] = [
    {
      title: 'Kezdőlap',
      link: '/',
      disabled: false
    },
    {
      title: 'Események',
      link: '/events',
      disabled: false
    },
    {
      title: 'Éttermek',
      link: '/ettermek',
      disabled: false
    },
    {
      title: 'Hibajegyek',
      link: '/tickets',
      disabled: false
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

  constructor(private router: Router, private accountClient: AccountClient, private credentialsService: CredentialsService) {}

  get name() {
    return 'ISMERETLEN';
  }

  ngOnInit() {
    // this.profilImage = this.credentialsService.credentials.picture;
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
    // return !this.credentialsService.isAuthenticated || !includes(roles, this.credentialsService.credentials.role);
  }
}
