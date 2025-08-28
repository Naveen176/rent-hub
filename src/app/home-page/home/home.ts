import { Component, input, signal } from '@angular/core';
import { ListingCard } from '../../listings/listing-card/listing-card';
import { test, testDataList } from '../../constants/modal.options';
import { ListingInfo } from '../../listings/listing-info/listing-info';
import { Loader } from '../../shared/components/loader/loader';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingModel } from '../../models/listing.model';

@Component({
  selector: 'app-home',
  imports: [ListingCard, ListingInfo, Loader, NgTemplateOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  item = signal<ListingModel>(testDataList[1]);
  rentalRecords = signal<any[]>([]);
  showLoader = signal<boolean>(false);
  showLatest = signal<boolean>(true);

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe((params) => {
      if (params && Object.keys(params).length > 0) {
        this.showLatest.set(false);
      } else {
        this.showLatest.set(true);
      }
    });
    this.updateListingInfo();
  }

  updateListingInfo() {
    const localItems = localStorage.getItem('rent-hub');
    if (localItems) {
      const parsedItems = JSON.parse(localItems);
      this.item.set(parsedItems[parsedItems.length - 1]);
      this.rentalRecords.set(parsedItems);
    } else {
      localStorage.setItem('rent-hub', JSON.stringify(testDataList));
    }
  }

  viewInfo(info: any) {
    if (info.id) {
      const params = { id: info.id };
      this.showLoader.set(true);
      setTimeout(() => {
        this.router.navigate(['rent-hub/view-post'], { queryParams: params });
        this.showLoader.set(false);
      }, 1000);
    }
  }
}
