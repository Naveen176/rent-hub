import { Component, input, output } from '@angular/core';
import { ListingModel } from '../../models/listing.model';

@Component({
  selector: 'app-listing-card',
  imports: [],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css',
})

export class ListingCard {
  item = input<ListingModel | undefined>();
  showViewBtn = input<boolean>(true);
  showFavBtn = input<boolean>(false);
  showImage = input<boolean>(true);

  viewInfo = output<any>();
  markAsFavourite = output();
  
  viewDetails() {
    this.viewInfo.emit(this.item());
  }

  markFavourite() {
    this.markAsFavourite.emit();
  }

}