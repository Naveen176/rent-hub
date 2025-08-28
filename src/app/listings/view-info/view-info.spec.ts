import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInfo } from './view-info';
import { ActivatedRoute } from '@angular/router';

describe('ViewInfo', () => {
  let component: ViewInfo;
  let fixture: ComponentFixture<ViewInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInfo],
      providers: [ActivatedRoute],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
