import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationService } from './services/registration.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { UserDataWithCredentials } from './models/user-data';
import { ToastrService } from 'ngx-toastr';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let dataServiceSpy: jasmine.SpyObj<RegistrationService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>
  let el: HTMLElement;
  const validCredentials: UserDataWithCredentials = {
    firstName: 'first',
    lastName: 'last',
    email: 'test@gmail.com',
    password: 'Password123',
  };

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('RegistrationService', ['signUp']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    await TestBed.configureTestingModule({
      declarations: [RegistrationComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: RegistrationService, useValue: dataServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
    const { password, ...userData } = validCredentials;
    dataServiceSpy.signUp.and.returnValue(of({ ...userData, _id: '123' }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init sign-up form', () => {
    it('should create form and to be valid', () => {
      expect(component.signUpForm).toBeDefined();
      expect(component.signUpForm.valid).toBeDefined();
    });
    it('should render the form', () => {
      const form = el.querySelector('#sign_up_form');
      expect(form).not.toBeNull();
    });
  });

  describe('form validation', () => {
    describe('first name field', () => {
      it('should be invalid with required error', function () {
        testingInvalidRequiredField(component.firstName);
      });
      it('should be valid', () => {
        testingValidRequiredField(component.firstName, 'Test data');
      });
    });

    describe('last name field', () => {
      it('should be invalid with required error', function () {
        testingInvalidRequiredField(component.lastName);
      });
      it('should be valid', () => {
        testingValidRequiredField(component.lastName, 'Test data');
      });
    });

    describe('email field', () => {
      it('should be invalid with required error', function () {
        testingInvalidRequiredField(component.email);
      });
      it('should pass required and email validation', () => {
        testingValidRequiredField(component.email, 'lucian.lazar@gmail.com');
      });
      it('should be invalid email - lucian', () => {
        testingInvalidEmail(component.email, 'lucian');
      });
      it('should be invalid email - lucian@', () => {
        testingInvalidEmail(component.email, 'lucian@');
      });
      it('should be invalid email - lucian@com', () => {
        testingInvalidEmail(component.email, 'lucian@com');
      });
      it('should be invalid email - @gmail.com', () => {
        testingInvalidEmail(component.email, '@gmail.com');
      });
    });

    describe('password field', () => {
      it('should be invalid with required error', () => {
        testingInvalidRequiredField(component.password);
      });
      it('should pass required and other validations', () => {
        testingValidRequiredField(component.password, 'Password123');
      });
      it('should be invalid password - min length', () => {
        testingInvalidField(component.password, 'pass', 'minlength');
      });
      it('should be invalid password - to contain upper case', () => {
        testingInvalidField(component.password, 'pass', 'upperCase');
      });
      it('should be invalid password - to contain lower case', () => {
        testingInvalidField(component.password, 'PASS', 'lowerCase');
      });
    });

    describe('form validity', () => {
      it('should not be valid if password contain the last name', function () {
        const newData = {
          ...validCredentials,
          lastName: 'last',
          password: 'lastName123',
        };
        component.signUpForm.patchValue(newData);
        component.submitData();
        expect(component.signUpForm.valid).toBeFalse();
        expect(component.signUpForm?.errors?.include).toBeDefined();
      });
      it('should not be valid if password contain the first name', function () {
        const newData = {
          ...validCredentials,
          firstName: 'first',
          password: 'Namefirst123',
        };
        component.signUpForm.patchValue(newData);
        component.submitData();
        expect(component.signUpForm.valid).toBeFalse();
        expect(component.signUpForm?.errors?.include).toBeDefined();
      });
    });
    describe('#submitData', () => {
      it('should not call the data service if the form is invalid', () => {
        component.signUpForm.patchValue({ firstName: '' });
        component.submitData();
        expect(dataServiceSpy.signUp).not.toHaveBeenCalled();
      });
      it('should call the data service if the form is valid and show notification', () => {
        const { password, ...calledData } = validCredentials;
        component.signUpForm.patchValue(validCredentials);
        component.submitData();
        expect(dataServiceSpy.signUp).toHaveBeenCalledWith(calledData);
        expect(toastrSpy.success).toHaveBeenCalled();
      });
      it('should notification if service return an error', () => {
        dataServiceSpy.signUp.and.returnValue(throwError('error'))
        const { password, ...calledData } = validCredentials;
        component.signUpForm.patchValue(validCredentials);
        component.submitData();
        expect(dataServiceSpy.signUp).toHaveBeenCalledWith(calledData);
        expect(toastrSpy.error).toHaveBeenCalled();
      });
    });
  });

  function testingInvalidRequiredField(field: AbstractControl | null): void {
    testingInvalidField(field, '', 'required');
  }
  function testingValidRequiredField(
    field: AbstractControl | null,
    value: string
  ): void {
    expect(field).toBeDefined();
    field?.patchValue(value);
    component.submitData();
    expect(field?.valid).toBeTruthy();
    expect(field?.errors?.required).not.toBeDefined();
  }
  function testingInvalidEmail(
    field: AbstractControl | null,
    value: string
  ): void {
    testingInvalidField(field, value, 'pattern');
  }
  function testingInvalidField(
    field: AbstractControl | null,
    value: string,
    errorName: string
  ) {
    expect(field).toBeDefined();
    field?.patchValue(value);
    component.submitData();
    expect(field?.valid).toBeFalse();
    if (field?.errors && errorName in field?.errors) {
      expect(field?.errors[errorName]).toBeDefined();
    }
  }
});
