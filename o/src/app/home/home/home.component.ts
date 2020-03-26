import { Component, OnInit } from '@angular/core';
import { SystemClient, AccountClient } from '@app/api/app.generated';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { CredentialsService } from '../../core/authentication/credentials.service';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { getIrodaCode } from '../../shared/three-view/iroda-labels';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  version: string;
  model: any = null;
  sel = new ReplaySubject(1);
  targyalo = new ReplaySubject(1);
  cUsers = new ReplaySubject(1);

  constructor(
    private systemClient: SystemClient,
    private http: HttpClient,
    private credentialsService: CredentialsService,
    private accountClient: AccountClient
  ) {}
  ngOnInit() {
    this.sel.next("C35");
    this.cUsers.next([]);
    // this.systemClient.getVersion().subscribe(x => (this.version = x));
    // if (this.credentialsService.credentials.officeLocation && this.credentialsService.credentials.officeLocation[0] === 'C') {
    //   this.sel.next(this.credentialsService.credentials.officeLocation);
    // }
    // this.accountClient.getUsers().subscribe(x => {
    //   this.cUsers.next(x.filter(y => y.officeLocation && y.officeLocation[0] === 'C'));
    // });

    // this.accountClient.getRooms().subscribe(y => {
    //   const data = y.map(x => {
    //     return { id: getIrodaCode(x.roomEmail.split('@')[0]), free: x.schedules.length === 0 || x.schedules[0].start > new Date() };
    //   });
    //   data.forEach(x => this.targyalo.next(x));
    //   // this.targyalo.next({free: true, id: 'C18'});
    //   // this.targyalo.next({free: false, id: 'C19'});
    //   console.log(data);
    // });
  }

  roomSelected(e: any) {
    this.sel.next(e);
  }
}
