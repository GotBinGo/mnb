import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Credentials, CredentialsService } from './credentials.service';
import { AccountClient } from '../../api/app.generated';
import { map } from 'rxjs/operators';
import { Token } from '../models/token';
import * as jwtDecode from 'jwt-decode';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

@Injectable()
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private accountClient: AccountClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    return <any>of({});
  }
}
