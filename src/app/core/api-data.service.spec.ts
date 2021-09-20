import { TestBed } from '@angular/core/testing';

import { ApiDataService } from './api-data.service';
import { HttpClientModule } from '@angular/common/http';

describe('ApiDataService', () => {
  let service: ApiDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(ApiDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
