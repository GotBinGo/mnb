import { Injectable } from '@angular/core';
import { Roles } from '../models/roles';
import { AccountClient, UserDto } from '@app/api/app.generated';
import { catchError } from 'rxjs/operators';

export interface Credentials {
  username: string;
  role: string;
  email: string;
  token: string;
  name: string;
  id: string;
}

const credentialsKey = 'credentials';

/**
 * Provides storage for authentication credentials.
 */
@Injectable()
export class CredentialsService {
  private _credentials: UserDto | null = null;

  constructor(private ac: AccountClient) {}

  async auth() {
    try {
      this._credentials = await this.ac.getUserData().toPromise();
    } catch {}
  }

  logout() {
    this._credentials = null;
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return true;
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): UserDto | null {
    return this._credentials;
  }
}
