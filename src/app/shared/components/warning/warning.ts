import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-warning',
  imports: [],
  templateUrl: './warning.html',
  styleUrl: './warning.css'
})
export class Warning {

  @Input() header: string = '⚠️ Login failed Invalid email or password. Please check you credentials and try again !'

  constructor(private activeModal:NgbActiveModal) {}

  close() {
    this.activeModal.close(true)
  }
}
