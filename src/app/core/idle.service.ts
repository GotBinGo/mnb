import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LogService } from './log.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  idleState = new BehaviorSubject(false);
  onIdle = new Subject();
  private idleTimeout: any;

  constructor(private logService: LogService) {}

  attach() {
    window.addEventListener('mousemove', this.ping);
    window.addEventListener('click', this.ping);

    this.ping();
  }

  ping = () => {
    if (this.idleState.value) {
      this.idleState.next(false);
      this.logService.log('Getting out of idle');
    }
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    this.idleTimeout = setTimeout(this.goToIdle, environment.idleTime || 50 * 60_000);
  };

  goToIdle = () => {
    this.logService.log('Going into idle');
    this.idleState.next(true);
    this.onIdle.next();
  };

  getIdleStateSubject() {
    return this.idleState;
  }

  getOnIdleSubject() {
    return this.onIdle;
  }
}
