import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinksComponent } from './links/links.component';
import { LinksRoutingModule } from './links-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [LinksComponent],
  imports: [CommonModule, LinksRoutingModule, FormsModule, SharedModule, NgbModule]
})
export class LinksModule {}
