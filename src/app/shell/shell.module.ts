import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ShellComponent } from './shell/shell.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [CommonModule, NgbModule, RouterModule, FormsModule],
  declarations: [HeaderComponent, ShellComponent]
})
export class ShellModule {}
