import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentHistory } from './comment-history';

describe('CommentHistory', () => {
  let component: CommentHistory;
  let fixture: ComponentFixture<CommentHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
