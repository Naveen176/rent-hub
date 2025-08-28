import { TestBed } from '@angular/core/testing';
import { ListingModel } from '../models/listing.model';
import { ListingService } from './listing-service';

describe('ListingService', () => {
  let service: ListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingService);
    localStorage.clear();
  });

  it('should update localItems from localStorage', () => {
    const mockData = [
      { title: 'Flat A', type: 'apartment' },
      { title: 'Flat B', type: 'house' },
    ];
    localStorage.setItem('rent-hub', JSON.stringify(mockData));
    
    service.updateListingInfo();
    
    expect(service.localItems()).toEqual(mockData);
  });

    it('should return matched items by title (case-insensitive)', () => {
    const mockData = [
      { title: 'Luxury Flat' },
      { title: 'Cheap House' },
      { title: 'luxury villa' }
    ];
    localStorage.setItem('rent-hub', JSON.stringify(mockData));

    const results = service.search('luxury');

    expect(results.length).toBe(2);
    expect(results).toEqual([
      { title: 'Luxury Flat' },
      { title: 'luxury villa' }
    ]);
  });

  it('should return empty array if no match found', () => {
    const mockData = [{ title: 'Basic Apartment' }];
    localStorage.setItem('rent-hub', JSON.stringify(mockData));

    const results = service.search('villa');

    expect(results.length).toBe(0);
  });

    it('should return items matching all filters', () => {
    const mockData = [
      { title: 'A', type: 'apartment', leaseType: 'monthly' },
      { title: 'B', type: 'apartment', leaseType: 'yearly' },
      { title: 'C', type: 'house', leaseType: 'monthly' }
    ];
    localStorage.setItem('rent-hub', JSON.stringify(mockData));

    const filter: ListingModel = {
      type: 'apartment',
      leaseType: 'monthly'
    } as ListingModel;

    const results = service.filters(filter);
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('A');
  });

  it('should return all items if empty filters passed', () => {
    const mockData = [
      { title: 'A', type: 'apartment' },
      { title: 'B', type: 'house' }
    ];
    localStorage.setItem('rent-hub', JSON.stringify(mockData));

    const filter: ListingModel = {} as ListingModel;

    const results = service.filters(filter);
    expect(results.length).toBe(2);
  });

    it('should return correct params object from ListingModel', () => {
    const filter: ListingModel = {
      type: 'apartment',
      leaseType: 'monthly',
      negotiable: true,
      priceMode: 'fixed'
    } as ListingModel;

    const result = service.getParams(filter);

    expect(result).toEqual({
      type: 'apartment',
      leaseType: 'monthly',
      negotiable: true,
      priceMode: 'fixed'
    });
  });

  it('should return empty object if no fields provided', () => {
    const filter: ListingModel = {} as ListingModel;
    const result = service.getParams(filter);
    expect(result).toEqual({});
  });
});
