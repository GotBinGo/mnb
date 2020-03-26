import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, Provider } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShellModule } from './shell/shell.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { Title, BrowserModule } from '@angular/platform-browser';
import { CredentialsService } from './core/authentication/credentials.service';

export function initConfiguration(cs: CredentialsService): Function {
  return async () => {
    // KIOSK id és secret beolvasása és elmentése
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    const secret = url.searchParams.get('secret');

    if (!!id && !!secret) {
      cs.kioskId = id;
      cs.kioskSecret = secret;
    }

    await cs.auth();
  };
}
export const INIT_CONFIGURATION: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initConfiguration,
  deps: [CredentialsService],
  multi: true
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    ShellModule,
    AppRoutingModule // must be imported as the last module as it contains the fallback route
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule {}
