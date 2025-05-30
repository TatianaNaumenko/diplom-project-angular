import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { CommentComponent } from './components/comment/comment/comment.component';




@NgModule({

  imports: [
    CommonModule,
    RouterLink,
  ],
  exports: [
    ArticleCardComponent,
    CommentComponent

  ],
  declarations: [
    ArticleCardComponent,
    CommentComponent,

  ],
})
export class SharedModule { }
