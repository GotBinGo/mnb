import { Injectable } from '@angular/core';
import { AccountClient, UserDto, CurrentUserDto } from '@app/api/app.generated';
import { catchError } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

const credentialsKey = 'credentials';
const kioskIdKey = 'kioskId';
const kioskSecretKey = 'kioskSecret';

/**
 * Provides storage for authentication credentials.
 */
@Injectable()
export class CredentialsService {
  private _credentials: CurrentUserDto | null = null;
  private _kioskId: string;
  private _kioskSecret: string;

  private users$: ReplaySubject<UserDto[]>;

  constructor(private ac: AccountClient) {}

  async auth() {
    try {
      this._credentials = await this.ac.getUserData().toPromise();
    } catch {}
  }

  logout() {
    this._credentials = null;
  }

  getUsers() {
    if (this.users$) {
      return this.users$;
    }
    this.users$ = new ReplaySubject<UserDto[]>(1);
    this.ac.getUsers().subscribe(x => this.users$.next(x), x => this.users$.error(x), () => this.users$.complete());
    return this.users$.asObservable();
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return true;
    // return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): CurrentUserDto | null {
    return this._credentials;
  }

  get isKiosk(): boolean {
    if (this._kioskId === undefined) {
      this._kioskId = localStorage.getItem(kioskIdKey);
    }
    return this._kioskId != null;
  }

  get kioskId(): string {
    if (this._kioskId === undefined) {
      this._kioskId = localStorage.getItem(kioskIdKey);
    }
    return this._kioskId;
  }

  set kioskId(id: string) {
    localStorage.setItem(kioskIdKey, id);
    this._kioskId = id;
  }

  get kioskSecret(): string {
    if (this._kioskSecret === undefined) {
      this._kioskSecret = localStorage.getItem(kioskSecretKey);
    }
    return this._kioskSecret;
  }

  set kioskSecret(secret: string) {
    localStorage.setItem(kioskSecretKey, secret);
    this._kioskSecret = secret;
  }
}
