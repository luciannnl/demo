import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData, UserRegistered } from '../models/user-data';
import { ApiDataService } from '@core/api-data.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private readonly usersEndpoint = 'users';
  constructor(private apiService: ApiDataService) {}

  /**
   * Send the user data to the API.
   * @param data
   */
  signUp(data: UserData): Observable<UserRegistered> {
    return this.apiService.post<UserData, UserRegistered>(
      this.usersEndpoint,
      data
    );
  }
}
