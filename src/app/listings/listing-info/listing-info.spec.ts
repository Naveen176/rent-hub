import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ListingService } from '../../services/listing-service';
import { ListingInfo } from './listing-info';
import { ListingCard } from '../listing-card/listing-card';

@Component({
  selector: 'app-host-component',
  template: `<app-listing-info [rentalRecords]="records"></app-listing-info>`,
  standalone: true,
  imports: [ListingInfo]
})
class TestHostComponent {
  records = [
    { id: 1, title: 'Test Listing 1' },
    { id: 2, title: 'Test Listing 2' }
  ];
}

describe('ListingInfo Component', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let component: ListingInfo;

  let queryParamsSubject: Subject<any>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockListingService: any;

  const mockRentalRecords = [
    { id: 1, title: 'Test Listing 1' },
    { id: 2, title: 'Test Listing 2' }
  ];

  beforeEach(async () => {
    queryParamsSubject = new Subject();

    mockActivatedRoute = {
      queryParams: queryParamsSubject.asObservable()
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockListingService = {
      filters: jasmine.createSpy('filters').and.returnValue(mockRentalRecords),
      search: jasmine.createSpy('search').and.callFake((title: string) => {
        return mockRentalRecords.filter(item => item.title.includes(title));
      })
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ListingCard],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ListingService, useValue: mockListingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    const listingDebugEl = fixture.debugElement.children[0];
    component = listingDebugEl.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load rental records on init when no title param exists', () => {
    queryParamsSubject.next({}); // Emit empty params
    component.ngOnInit();

    expect(component.listOfItems()).toEqual(mockRentalRecords);
  });

  it('should call search and update listOfItems if title param exists', () => {
    const searchTitle = 'Test';
    queryParamsSubject.next({ title: searchTitle });
    component.ngOnInit();

    expect(mockListingService.search).toHaveBeenCalledWith(searchTitle);
    expect(component.listOfItems().length).toBeGreaterThan(0);
  });

  it('should navigate to view-post when viewInfo is called with an id', () => {
    const mockItem = { id: 123 };
    component.viewInfo(mockItem);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['rent-hub/view-post'], {
      queryParams: { id: 123 }
    });
  });

  it('should not navigate if viewInfo is called with missing id', () => {
    component.viewInfo({});
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
  
});
