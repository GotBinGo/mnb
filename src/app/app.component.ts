import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, switchMap } from 'rxjs/operators';
import { IdleService } from './core/idle.service';
import { CredentialsService } from './core/authentication/credentials.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Pénz Mosó';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private idleService: IdleService,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit() {
    if (this.credentialsService.isKiosk) {
      this.idleService.attach();

      this.idleService.getOnIdleSubject().subscribe(_ => {
        this.router.navigate(['']);
      });
    }
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        switchMap(route => route.data)
      )
      .subscribe(event => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(`${title} | ${this.title}`);
        } else {
          this.titleService.setTitle(this.title);
        }
      });
  }
}
