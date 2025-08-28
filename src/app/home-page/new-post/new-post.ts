import { Component, ElementRef, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { amenities, modalOptions, testDataList } from '../../constants/modal.options';
import { Discard } from '../../shared/components/discard/discard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common-service';
import { Numbersonly } from '../../shared/directives/numbersonly';
import { ViewInfo } from '../../listings/view-info/view-info';
import { Loader } from '../../shared/components/loader/loader';
import { NgTemplateOutlet } from '@angular/common';
import { Warning } from '../../shared/components/warning/warning';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  imports: [ReactiveFormsModule, Numbersonly, NgTemplateOutlet, Loader],
  templateUrl: './new-post.html',
  styleUrl: './new-post.css',
})
export class NewPost {
  attemptedSubmit = signal<boolean>(false);
  showLoader = signal<boolean>(false);
  modalOptions = modalOptions;
  amenities = amenities;
  rentalRecords = signal<any[]>([]);

  private fb = inject(FormBuilder);

  constructor(
    private modalService: NgbModal,
    private commonService: CommonService,
    private el: ElementRef,
    private router: Router
  ) {
    const localRecords = localStorage.getItem('rent-hub');
    if (localRecords) {
      this.rentalRecords.set(JSON.parse(localRecords));
    }
  }

  formGroup: FormGroup = this.fb.group({
    type: ['', Validators.required],
    name: ['', Validators.required],
    sharedProperty: [''],
    streetAddress: ['', Validators.required],
    sqFt: [''],
    leaseType: ['', Validators.required],
    expectedRent: ['', Validators.required],
    negotiable: [''],
    priceMode: [''],
    furnished: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    amenity: [''],
    amenitiesIncluded: this.fb.array([]),
    buildingImage: this.fb.array([]),
    comments: this.fb.array([]),
  });

  back() {
    this.router.navigate(['/rent-hub/home']);
  }

  discard() {
    const modalRef = this.modalService.open(Discard, { ...this.modalOptions, size: 's' });
    modalRef.closed.subscribe((res) => {
      if (res) {
        this.formGroup.reset();
      }
    });
  }

  preview() {
    const modalRef = this.modalService.open(ViewInfo, { ...this.modalOptions, size: 'lg' });
    modalRef.componentInstance.rentItem = this.formGroup.value;
    modalRef.componentInstance.showPreview = true;
    modalRef.closed.subscribe((res) => {
      if (res) {
      }
    });
  }

  addPost() {
    this.attemptedSubmit.set(true);
    if (this.validateForm()) {
      const modalRef = this.modalService.open(Discard, { ...this.modalOptions, size: 's' });
      modalRef.componentInstance.header =
        'Are you sure you want to publish details for rental ? please check details before publishing for the rental';
      modalRef.componentInstance.buttonLabel = 'publish';
      modalRef.componentInstance.customStyle = 'btn btn-primary';
      modalRef.componentInstance.navigate = false;
      modalRef.closed.subscribe((res) => {
        if (res) {
          this.showLoader.set(true);
          // this.commonService.fileUpload(this.formGroup.get('buildingImage')?.value);
          setTimeout(() => {
            const newRental = {
              ...this.formGroup.value,
              id: this.rentalRecords().length,
              publisherEmail: localStorage.getItem('userName'),
            };
            this.rentalRecords.set([...this.rentalRecords(), newRental]);
            localStorage.setItem('rent-hub', JSON.stringify(this.rentalRecords()));
            this.formGroup.reset();
            this.showLoader.set(false);
            const successModalRef = this.modalService.open(Warning, {
              ...this.modalOptions,
              size: 'm',
            });
            successModalRef.componentInstance.header =
              'Thanks for sharing your space! Your listing is now active on Rental Hub.';
            successModalRef.closed.subscribe((res) => {
              if (res) {
                this.router.navigate(['']);
              }
            });
          }, 1500);
        }
      });
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

  get amenitiesIncluded(): FormArray {
    return this.formGroup.get('amenitiesIncluded') as FormArray;
  }

  onAmenityChange(event: Event, amenity: string) {
    const checked = (event.target as HTMLInputElement).checked;
    const amenitiesArray = this.amenitiesIncluded;

    if (checked) {
      amenitiesArray.push(this.fb.control(amenity));
    } else {
      const index = amenitiesArray.controls.findIndex((x) => x.value === amenity);
      if (index !== -1) {
        amenitiesArray.removeAt(index);
      }
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const imagesArray = this.formGroup.get('buildingImage') as FormArray;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && file.type.startsWith('image/')) {
        const fileUrl = URL.createObjectURL(file);
        imagesArray.push(this.fb.control(fileUrl));
      }
    }
    this.formGroup.patchValue({buildingImage:imagesArray})
    this.formGroup.updateValueAndValidity();
  }
}
