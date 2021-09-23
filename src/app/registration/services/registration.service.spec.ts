import { of } from 'rxjs';
import { UserData, UserRegistered } from './../models/user-data';
import { TestBed } from '@angular/core/testing';

import { RegistrationService } from './registration.service';
import { ApiDataService } from '@core/api-data.service';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let apiServiceSpy: jasmine.SpyObj<ApiDataService>;
  const mockUser: UserData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@email.com'
  }

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiDataService', ['post']);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiDataService, useValue: apiServiceSpy }],
    });
    service = TestBed.inject(RegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the api service on #signUp', () => {
    const mockResponse: UserRegistered = {...mockUser, _id: '1'}
    apiServiceSpy.post.and.returnValue(of(mockResponse));
    service.signUp(mockUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    })
    expect(apiServiceSpy.post).toHaveBeenCalledOnceWith(service.usersEndpoint, mockUser);
    expect(apiServiceSpy.post).toHaveBeenCalledTimes(1);
  })
});
