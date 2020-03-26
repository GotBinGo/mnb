import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@app/core/log.service';
import { MatDialogRef } from '@angular/material';
import { IdleService } from '@app/core/idle.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-developer-modal',
  templateUrl: './developer-modal.component.html',
  styleUrls: ['./developer-modal.component.scss']
})
export class DeveloperModalComponent implements OnInit, OnDestroy {
  commands: any[];
  date: Date;
  logs: any[] = [];
  idleSub: Subscription;

  @ViewChild('console', { static: true }) myConsole: ElementRef;

  constructor(private dialogRef: MatDialogRef<DeveloperModalComponent>, private logService: LogService, private idleService: IdleService) {}

  ngOnInit() {
    this.date = new Date();
    setInterval(() => (this.date = new Date()), 500);
    this.subscribeToLog();

    this.idleSub = this.idleService.getOnIdleSubject().subscribe(_ => this.close());
  }

  ngOnDestroy() {
    this.idleSub.unsubscribe();
  }

  subscribeToLog() {
    this.logService.logHistory.subscribe(x => {
      const scrollBottom =
        this.myConsole.nativeElement.scrollHeight - this.myConsole.nativeElement.clientHeight - this.myConsole.nativeElement.scrollTop;

      this.logs.push(x);

      // if on bottom, keep on bottom
      if (this.logs.length === 0 || scrollBottom < 60) {
        setTimeout(() => (this.myConsole.nativeElement.scrollTop = this.myConsole.nativeElement.scrollHeight));
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  refreshPage() {
    // tslint:disable-next-line: deprecation
    window.location.reload(true);
  }
}
