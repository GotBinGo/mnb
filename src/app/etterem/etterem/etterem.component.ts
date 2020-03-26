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
  public mtaTtkMenu: FacebookPageResponse;

  today = new Date().getDay();

  constructor(private spinnerService: SpinnerService, private etteremClient: EtteremClient) {}

  ngOnInit() {
    forkJoin([
      this.etteremClient.getEricsson({ loading: true }),
      this.etteremClient.getDoubleDelight({ loading: true }),
      this.etteremClient.getJustCantine({ loading: true }),
      this.etteremClient.getMtaTtk({ loading: true })
    ]).subscribe(([ericssonResult, doubleDelightResult, justCantineResult, mtaTtkResult]) => {
      this.ericssonMenu = ericssonResult;

      doubleDelightResult.content = doubleDelightResult.content.replace('...', '');
      this.doubleDelightMenu = doubleDelightResult;

      this.justCantineMenu = justCantineResult;

      mtaTtkResult.content = mtaTtkResult.content.replace('Továbbiak', '');
      // app service-ben más nyelven szerepel
      mtaTtkResult.content = mtaTtkResult.content.replace('Meer weergeven', '');
      this.mtaTtkMenu = mtaTtkResult;
    });
  }
}
