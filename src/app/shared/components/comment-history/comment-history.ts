import { Component, input, OnInit, output, signal } from '@angular/core';
import { Comment } from '../../../models/listing.model';
import { LocalDateTimePipe } from '../../pipes/local-date-time-pipe';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-history',
  imports: [LocalDateTimePipe,ReactiveFormsModule],
  templateUrl: './comment-history.html',
  styleUrl: './comment-history.css',
})
export class CommentHistory implements OnInit{
  id = input<any>('');
  publisherId = input<any>('');
  showReply = signal<boolean>(false);
  commentHistory = input<Comment[] | undefined>([]);
  localItems = signal<any[]>([]) 

  reply =  new FormControl('')
  addedReply = output()

  ngOnInit() {
    this.updateListingInfo()
  }

  updateListingInfo() {
    const localItems = localStorage.getItem('rent-hub')
    if (this.id()) {
      this.isOwner();
    }
    if(localItems) {
      this.localItems.set(JSON.parse(localItems))
    }
  }

  isOwner() {
    const userId = localStorage.getItem('userName');
    this.showReply.set(false)
    if(userId && userId == this.publisherId()){
      this.showReply.set(true)
    }
  }

  addReply(comment: Comment) {
    const replyText = this.reply.value?.trim() ?? '';
    if (!replyText) return;
    this.updateListingInfo()
    const index = this.localItems().findIndex(item => item.id === this.id());
    const listing = this.localItems()[index];
    const commentIndex = listing.comments.findIndex((c: Comment) => c.id === comment.id);
    listing.comments[commentIndex].reply = replyText;
    this.localItems()[index] = listing
    localStorage.setItem('rent-hub', JSON.stringify(this.localItems()));
    this.addedReply.emit(listing);
    this.reply.reset();
  }

}
