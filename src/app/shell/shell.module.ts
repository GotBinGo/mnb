import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ShellComponent } from './shell/shell.component';
import { HeaderComponent } from './header/header.component';
import { MatSidenavModule, MatCardModule } from '@angular/material';
import { PopupComponent } from './popup/popup.component';
import { SortablejsModule } from 'ngx-sortablejs';

@NgModule({
  imports: [CommonModule, NgbModule, RouterModule, FormsModule, MatSidenavModule, MatCardModule, SortablejsModule],
  declarations: [HeaderComponent, ShellComponent, PopupComponent]
})
export class ShellModule {}
