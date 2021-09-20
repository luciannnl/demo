import { TestBed } from '@angular/core/testing';

import { RegistrationService } from './registration.service';
import { ApiDataService } from '@core/api-data.service';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let apiServiceSpy: jasmine.SpyObj<ApiDataService>;

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
});
