import { Component, effect, input, OnInit, signal } from '@angular/core';
import { ListingCard } from '../listing-card/listing-card';
import { test, testDataList } from '../../constants/modal.options';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../services/listing-service';

@Component({
  selector: 'app-listing-info',
  imports: [ListingCard],
  templateUrl: './listing-info.html',
  styleUrl: './listing-info.css',
})
export class ListingInfo implements OnInit {
  listOfItems = signal<any[]>([]);
  rentalRecords = input<any[]>([]);
  params = signal<any>([]);

  filtersEffect$ = effect(() => {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.params.set(params);
    });
    if(this.params()) {
      this.listOfItems.set(this.listingService.filters(this.params()));
      console.log(this.listOfItems())
    } else {
      this.listOfItems.set(this.rentalRecords());
    }
  });

  searchEffect$ = effect(() => {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.params.set(params);
    });
    if (this.params().title) {
      this.listOfItems.set(this.listingService.search(this.params().title));
    } else {
      this.listOfItems.set(this.rentalRecords());
    }
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private listingService: ListingService
  ) {
    activatedRoute.queryParams.subscribe((params) => {
      this.params.set(params);
    });
  }

  ngOnInit(): void {
    if (this.params().title) {
      this.listOfItems.set(this.listingService.search(this.params().title));
    } else {
      this.listOfItems.set(this.rentalRecords());
    }
  }

  viewInfo(info: any) {
    if (info.id) {
      const params = { id: info.id };
      this.router.navigate(['rent-hub/view-post'], { queryParams: params });
    }
  }
}
