import { Component, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  attemptedSubmit = signal<boolean>(false);

  private fb = inject(FormBuilder);

  formGroup: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private commonService: CommonService,
    private el: ElementRef
  ) {}

  cancel() {
    this.activeModal.close();
  }

  login() {
    this.attemptedSubmit.set(true);
    if (this.validateForm()) {
      this.activeModal.close(this.formGroup.value);
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
