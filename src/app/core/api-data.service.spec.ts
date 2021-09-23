import { of, throwError } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { ApiDataService } from './api-data.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface Data {
  name: string;
}

interface ResponseData extends Data {
  id: string;
}

describe('ApiDataService', () => {
  let service: ApiDataService;
  let httpTestingController: HttpTestingController;
  const testUrl = '/base-url';
  let handlerSpy: jasmine.SpyObj<ErrorHandlerService>

  beforeEach(() => {
    handlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ErrorHandlerService, useValue: handlerSpy }
      ]
    });
    service = TestBed.inject(ApiDataService);
    httpTestingController = TestBed.inject(HttpTestingController);
    service.apiBaseUrl = testUrl;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#post', () => {
    const url = 'test';
    const data: Data = {name: 'testData'};
    const reqUrl = `${testUrl}/${url}`;

    it('shuld return data with success', () => {
      service.post(url, data).subscribe(response => {
        expect(response).toEqual(data);
      })
      const req = httpTestingController.expectOne(reqUrl);
      expect(req.request.method).toEqual('POST');
      req.flush(data);
      httpTestingController.verify()
    });

    it('should handle the api errors', () => {
      const emsg = 'this is a 404 error';
      handlerSpy.handleError.and.returnValue(throwError({error: emsg, status: 404}));
      service.post(url, data).subscribe(
        data => fail('should have failed with the 404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404, 'status');
          expect(error.error).toEqual(emsg, 'message');
        }
      );
  
      const req = httpTestingController.expectOne(reqUrl);

      req.flush(emsg, { status: 404, statusText: 'Not Found' });
    });

    it('should handle the network errors', () => {
      const emsg = 'this is anetwork error';
      const mockError = new ErrorEvent('Network error', {
        message: emsg,
      });
      handlerSpy.handleError.and.returnValue(throwError({error: mockError}));
      service.post(url, data).subscribe(
        data => fail('should have failed with the network error'),
        (error: HttpErrorResponse) => {
          expect(error.error.message).toEqual(emsg, 'message');
        }
      );
      const req = httpTestingController.expectOne(reqUrl);

      req.error(mockError);
    });
  });
});
