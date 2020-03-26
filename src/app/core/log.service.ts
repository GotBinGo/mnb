import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  logHistory: ReplaySubject<{ type: string; message: any; date: Date }>;

  constructor() {
    this.init();
  }

  log(...attr: any) {
    this.addToLog('log', ...attr);
  }

  error(...attr: any) {
    this.addToLog('error', ...attr);
  }

  private init() {
    this.logHistory = new ReplaySubject(200);
  }

  private addToLog(type: string, ...attr: any) {
    this.logHistory.next({ type, message: JSON.stringify(attr), date: new Date() });
  }
}
