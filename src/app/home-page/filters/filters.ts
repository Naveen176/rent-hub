import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { amenities } from '../../constants/modal.options';

@Component({
  selector: 'app-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters {
  private fb = inject(FormBuilder);

  formGroup: FormGroup = this.fb.group({
    type: [''],
    leaseType: [''],
    negotiable: [''],
    priceMode: [''],
  });

  constructor(private activeModal: NgbActiveModal) {}

  cancel() {
    this.activeModal.close();
  }

  applyFilters() {
    this.activeModal.close(this.formGroup.value);
  }
}
