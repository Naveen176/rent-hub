export interface ListingModel {
  id: number;
  type?: string;
  name?: string;
  sharedProperty?: boolean;
  streetAddress: string;
  sqFt: string;
  leaseType: string;
  expectedRent: number;
  negotiable: boolean;
  priceMode: string;
  furnished?: boolean;
  amenitiesIncluded?: string[];
  amenities?: string;
  title: string;
  description: string;
  favourite?: boolean;
  comments?: Comment[];
  url?: string[];
  buildingImage?: string[];
  publisherName?: string;
  publisherEmail?: string;
}

export interface Comment {
  id:number;
  user: string;
  message: string;
  timestamp: Date;
  reply?: string;
}
