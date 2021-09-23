import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { PasswordValidator } from '@shared/validators/password.validator';
import { RegistrationService } from './services/registration.service';
import { UserDataWithCredentials } from './models/user-data';
import { ERROR_MESSAGES } from '@shared/data/error-messages';
import { ToastrService } from 'ngx-toastr';
import { pipe } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  @ViewChild('frm', {static: true}) formRef!: NgForm;
  passwordVisibility: boolean = false;
  isLoading = false;

  togglePasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }

  get firstName() {
    return this.signUpForm.get('firstName');
  }

  get lastName() {
    return this.signUpForm.get('lastName');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }
  readonly errorMessages = { ...ERROR_MESSAGES };

  signUpForm: FormGroup = this.fb.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          // This is the default Angular validator.
          // This is not so good because didn't validate some cases like 'test@com'
          // Validators.email
          // Or we can create an async validator which will validate email to specific service, like https://isitarealemail.com/
        ],
      ],
      // Or we can use ngx-custom-validators
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          PasswordValidator.upperCase,
          PasswordValidator.lowerCase,
        ],
      ],
    },
    {
      validators: PasswordValidator.containFields('password', [
        'firstName',
        'lastName',
      ]),
    }
  );

  constructor(
    private fb: FormBuilder,
    private dataService: RegistrationService,
    private toastr: ToastrService
  ) {}

  /**
   * Submit the form data to service.
   */
  submitData(): void {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      const { password, ...user } = this.signUpForm
        .value as UserDataWithCredentials;
      this.dataService.signUp(user)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        () => {
          this.formRef.resetForm();
          this.toastr.success('Registration complete!');
        },
        () => {
          this.toastr.error('Error!!!');
        }
      );
    }
  }
}
