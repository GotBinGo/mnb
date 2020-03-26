import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtteremComponent } from './etterem/etterem.component';
import { EtteremRoutingModule } from './etterem-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [EtteremComponent],
  imports: [CommonModule, EtteremRoutingModule, FormsModule, SharedModule, NgbModule]
})
export class EtteremModule {}
