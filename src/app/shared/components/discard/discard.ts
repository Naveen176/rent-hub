import { NgClass } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-discard',
  imports: [NgClass],
  templateUrl: './discard.html',
  styleUrl: './discard.css',
  standalone: true
})
export class Discard {

  @Input() header: string = 'Are you sure you want to discard ? all the changes will be lost and will navigate back to listing page';
  @Input() buttonLabel: string = 'Discard';
  @Input() customStyle: string = 'btn btn-danger';
  @Input() navigate: boolean = true;
  
  constructor(private activeModal: NgbActiveModal,private router: Router) {}

  closeModal() {
    this.activeModal.close();
  }

  discard() {
    this.activeModal.close(true);
    if(this.navigate) {
      this.router.navigate(['rent-hub/home'])
    }
  }
}
