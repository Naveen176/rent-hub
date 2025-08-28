import { Injectable, signal } from '@angular/core';
import { ListingModel } from '../models/listing.model';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  localItems = signal<any[]>([]);

  updateListingInfo() {
    const localItems = localStorage.getItem('rent-hub');
    if (localItems) {
      this.localItems.set(JSON.parse(localItems));
    }
  }

  search(title: string) {
    this.updateListingInfo();
    const matches = this.localItems().filter((rentInfo) =>
      rentInfo.title.toLowerCase().includes(title.toLowerCase())
    );
    return matches;
  }

  filters(filterModal: ListingModel) {
    this.updateListingInfo();
    const filters = this.localItems().filter((item) => {
      for (let key in filterModal) {
        const typedKey = key as keyof ListingModel;
        const itemValue = String(item[typedKey]).toLowerCase();
        const paramValue = String(filterModal[typedKey]).toLowerCase();
        if (itemValue !== paramValue) {
          return false;
        }
      }
      return true;
    });
    return filters;
  }

  getParams(filters: ListingModel) {
    const params: any = {};
    if (filters.type) {
      params['type'] = filters.type;
    }
    if (filters.leaseType) {
      params['leaseType'] = filters.leaseType;
    }
    if (filters.negotiable) {
      params['negotiable'] = filters.negotiable;
    }
    if (filters.priceMode) {
      params['priceMode'] = filters.priceMode;
    }
    return params;
  }
}
