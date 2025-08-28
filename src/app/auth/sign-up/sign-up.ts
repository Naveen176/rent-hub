import { Component, ElementRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonService } from '../../services/common-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Discard } from '../../shared/components/discard/discard';
import { AuthorizationInfo, modalOptions } from '../../constants/modal.options';
import { Warning } from '../../shared/components/warning/warning';
import { Router } from '@angular/router';
import { Loader } from '../../shared/components/loader/loader';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, NgTemplateOutlet, Loader],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  attemptedSubmit = signal<boolean>(false);
  showLoader = signal<boolean>(false);

  modalOptions = modalOptions;
  userRecords = AuthorizationInfo;

  private fb = inject(FormBuilder);

  formGroup: FormGroup;

  constructor(
    private el: ElementRef,
    private commonService: CommonService,
    private modalService: NgbModal,
    private router: Router
  ) {
    const localRecords = localStorage.getItem('user-info');
    this.formGroup = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        reentered: [''],
        streetAddress: [''],
        state: [''],
        zipcode: [''],
        comments: this.fb.array([])
      },
      { validators: this.checkPassword }
    );
    if(localRecords) {
      this.userRecords = JSON.parse(localRecords)
    }
  }

  checkPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const reentered = control.get('reentered')?.value;
    return password === reentered ? null : { passwordMismatch: true };
  }

  clearForm() {
    const modalRef = this.modalService.open(Discard, { ...this.modalOptions, size: 's' });
    modalRef.closed.subscribe((res) => {
      if (res) {
        this.formGroup.reset();
      }
    });
  }

  signUp() {
    this.attemptedSubmit.set(true);
    const email = this.formGroup.get('email')?.value;
    if (this.validateForm()) {
      const duplicateEmail = this.userRecords.find((user) => user.email === email);
      if (duplicateEmail) {
        const modalRef = this.modalService.open(Warning, { ...this.modalOptions, size: 'm' });
        modalRef.componentInstance.header =
          'An account with this email already exists. Please log in or use a different email address.';
        modalRef.closed.subscribe((res) => {
          if (res) {
            return;
          }
        });
        return
      }
      const payload = {
        ...this.formGroup.value,
      };
      delete payload.reentered;
      this.showLoader.set(true);
      setTimeout(() => {
        this.userRecords = [...this.userRecords, payload];
        localStorage.setItem('user-info', JSON.stringify(this.userRecords));
        const successModalRef = this.modalService.open(Warning, {
          ...this.modalOptions,
          size: 'm',
        });
        this.showLoader.set(false);
        this.formGroup.reset()
        successModalRef.componentInstance.header =
          'Thanks for joining Rental Hub! Find a place you’ll love — or help someone else by listing your space.';
        successModalRef.closed.subscribe((res) => {
          if (res) {
            this.router.navigate(['/rent-hub/home']);
          }
        });
      }, 1000);
    }
  }

  validateForm() {
    if (!this.formGroup.valid) {
      setTimeout(() => {
        this.scrollToInvalidControl();
      }, 100);
      return false;
    } else {
      this.attemptedSubmit.set(false);
      return true;
    }
  }

  scrollToInvalidControl() {
    setTimeout(() => {
      this.commonService.scrollToFirstInvalidControl(this.el);
    }, 100);
  }
}
