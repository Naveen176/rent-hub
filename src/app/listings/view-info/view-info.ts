import { Component, inject, Input, Optional, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingModel } from '../../models/listing.model';
import { CommentHistory } from '../../shared/components/comment-history/comment-history';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Loader } from '../../shared/components/loader/loader';
import { NgTemplateOutlet } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TextTransformPipe } from '../../shared/pipes/text-transform-pipe';

@Component({
  selector: 'app-view-info',
  imports: [CommentHistory, ReactiveFormsModule, NgTemplateOutlet, Loader,TextTransformPipe],
  templateUrl: './view-info.html',
  styleUrl: './view-info.css',
})
export class ViewInfo {

  @Input() showPreview: boolean = false;
  @Input() rentItem: ListingModel | null = null;

  id = signal<any>('');
  rentInfo = signal<ListingModel | null>(null);
  localItems = signal<any[]>([]);
  showLoader = signal<boolean>(false);
  showAddComment = signal<boolean>(false);

  private fb = inject(FormBuilder);

  formGroup: FormGroup = this.fb.group({
    comments: ['', Validators.required],
  });

  constructor(private activateRoute: ActivatedRoute, private router: Router, @Optional() public activeModal: NgbActiveModal) {
    activateRoute.queryParams.subscribe((params) => {
      this.id.set(params['id']);
    });
  }

  ngOnInit(): void {
    if (this.id()) {
      this.getRentItem();
    }
    if(this.rentItem) {
      this.rentInfo.set(this.rentItem)
    }
    if(localStorage.getItem('userName')) {
      this.showAddComment.set(true)
    }
  }

  getRentItem() {
    const localItems = localStorage.getItem('rent-hub');
    if (localItems) {
      this.rentInfo.set(
        JSON.parse(localItems).filter((item: any) => {
          return item.id == this.id();
        })[0]
      );
      this.localItems.set(JSON.parse(localItems));
    }
  }

  back() {
    this.router.navigate(['/rent-hub/home']);
  }

  close() {
    this.activeModal.close(true)
  }

  toggleFavorite() {
    const index = this.localItems().findIndex((item) => item.id === this.rentInfo()?.id);
    this.localItems()[index].favourite = !this.localItems()[index].favourite;
    this.rentInfo.set(this.localItems()[index]);
    localStorage.setItem('rent-hub', JSON.stringify(this.localItems()));
  }

  addComment() {
    if (this.formGroup.valid) {
      const comment = {
        id: '',
        comments: this.formGroup.getRawValue().comments,
        message: this.formGroup.getRawValue().comments,
        user: localStorage.getItem('userName'),
        timestamp: new Date(),
      };
      this.showLoader.set(true);
      setTimeout(() => {
        const index = this.localItems().findIndex((item) => item.id === this.rentInfo()?.id);
        comment.id = this.localItems()[index].comments.length;
        this.localItems()[index].comments = [comment,...this.localItems()[index].comments]
        this.rentInfo.set(this.localItems()[index]);
        localStorage.setItem('rent-hub', JSON.stringify(this.localItems()));
        this.formGroup.reset();
        this.showLoader.set(false);
      }, 1500);
    }
  }

  addReply(rentInfo: any) {
    this.rentInfo.set(rentInfo);
  }
}
