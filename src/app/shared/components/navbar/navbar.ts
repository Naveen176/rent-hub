import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Login } from '../../../auth/login/login';
import { AuthorizationInfo, modalOptions } from '../../../constants/modal.options';
import { Filters } from '../../../home-page/filters/filters';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../../services/common-service';
import { ListingService } from '../../../services/listing-service';
import { Warning } from '../warning/warning';
import { Discard } from '../discard/discard';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isLoggedIn = signal<boolean>(false);
  showCount = signal<boolean>(false);
  filtersCount = signal<number>(0);
  modalOptions = modalOptions;
  userRecords = signal<any[]>(AuthorizationInfo);
  searchTitle = '';

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private commonService: CommonService,
    private listingService: ListingService
  ) {
    const user = localStorage.getItem('userName');
    const localRecords = localStorage.getItem('user-info');
    if (user) {
      this.isLoggedIn.set(true);
    }
    if (localRecords) {
      this.userRecords.set(JSON.parse(localRecords));
    }
  }

  login() {
    const modalRef = this.modalService.open(Login, { ...this.modalOptions, size: 'm' });
    modalRef.closed.subscribe((res) => {
      if (res) {
        const match = this.userRecords().find(
          (user) => user.email === res.email && user.password === res.password
        );
        if (match) {
          localStorage.setItem('userName', res.email);
          this.isLoggedIn.set(true);
          const successModalRef = this.modalService.open(Warning, {
            ...this.modalOptions,
            size: 'm',
          });
          successModalRef.componentInstance.header = 'User Logged In Successfully !';
          this.router.navigate(['rent-hub/home']);
          return;
        }
        const warningModalRef = this.modalService.open(Warning, {
          ...this.modalOptions,
          size: 's',
        });
      }
    });
  }

  logOut() {
    const modalRef = this.modalService.open(Discard, { ...this.modalOptions, size: 'm' });
    modalRef.componentInstance.header =
      'Are you sure you want to logout ? will be redirected to listing page after logging out';
    modalRef.componentInstance.buttonLabel = 'logout';
    modalRef.componentInstance.customStyle = 'btn btn-primary';
    modalRef.closed.subscribe((res) => {
      if (res) {
        localStorage.removeItem('userName');
        this.isLoggedIn.set(false);
      }
    });
  }

  createPost() {
    this.router.navigate(['rent-hub/create-new-post']);
  }

  openFilterModal() {
    const modalRef = this.modalService.open(Filters, { ...this.modalOptions, size: 'm' });
    modalRef.closed.subscribe((res) => {
      if (res) {
        const params = this.listingService.getParams(res);
        this.filtersCount.set(this.filterCount(params));
        this.router.navigate(['/rent-hub/home'], { queryParams: params });
      }
    });
  }

  clearFilters() {
    this.filtersCount.set(0)
    this.router.navigate(['/rent-hub/home']);
  }

  filterCount(params: any) {
    return Object.keys(params).length
  }

  search() {
    if (this.searchTitle.trim().length > 4) {
      const params = { title: this.searchTitle.trim() };
      this.router.navigate(['/rent-hub/home'], { queryParams: params });
    }
  }

  clear() {
    this.searchTitle = '';
    this.router.navigate(['rent-hub/home']);
  }
}
