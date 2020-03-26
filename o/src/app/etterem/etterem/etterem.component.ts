import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { EtteremClient, EricssonParserResult, FacebookPageResponse } from '../../api/app.generated';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '@app/shared/loading-spinner/spinner.service';

@Component({
  selector: 'app-etterem',
  templateUrl: './etterem.component.html',
  styleUrls: ['./etterem.component.scss']
})
export class EtteremComponent implements OnInit {
  public ericssonMenu: EricssonParserResult;
  public doubleDelightMenu: FacebookPageResponse;
  public justCantineMenu: FacebookPageResponse;

  today = new Date().getDay();

  constructor(private spinnerService: SpinnerService, private etteremClient: EtteremClient) {}

  ngOnInit() {
    this.spinnerService.show();
    forkJoin([this.etteremClient.getEricsson(), this.etteremClient.getDoubleDelight(), this.etteremClient.getJustCantine()])
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe(([ericssonResult, doubleDelightResult, justCantineResult]) => {
        this.ericssonMenu = ericssonResult;

        doubleDelightResult.content = doubleDelightResult.content.replace('...', '');
        this.doubleDelightMenu = doubleDelightResult;

        this.justCantineMenu = justCantineResult;
      });
  }
}
