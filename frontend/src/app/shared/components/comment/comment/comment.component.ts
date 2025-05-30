import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { CommentType } from 'src/types/comment.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Component({
  selector: 'comment-component',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: CommentType | null = null;
  @Input() articleId: string = '';
  statusAction: string = '';
  isLogged: boolean = false;

  likeCount: number = 0
  dislikeCount: number = 0

  constructor(private commentService: CommentService,
              private _snackBar: MatSnackBar,
              private authService: AuthService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit() {
    if (this.comment) {
      this.likeCount = this.comment.likesCount;
      this.dislikeCount = this.comment.dislikesCount;

      if (this.isLogged) {
        this.commentService.getCommentAction(this.comment.id)
          .subscribe(data => {
            if (data.length > 0 && data[0].action) {
              this.statusAction = data[0].action;
            }
          });
      }
    }
  }

  setLike() {
    if (this.isLogged) {
      if (this.comment) {
        this.commentService.applyAction(this.comment.id, 'like')
          .subscribe(data => {

            if (this.comment) {
              this.commentService.getCommentAction(this.comment.id)
                .subscribe(data => {
                  if (data.length > 0 && data[0].action) {
                    if (this.statusAction === 'dislike') {
                      this.dislikeCount --;
                    }
                    this.likeCount ++;
                    this.statusAction = data[0].action;
                  } else {
                    this.statusAction = '';
                    this.likeCount --;
                  }
                });
            }
          });
      }
    } else {
      this._snackBar.open('Чтобы поставить лайк войдите в свой аккаунт');
    }


  }

  setDislike() {
    if (this.isLogged) {
      if (this.comment) {
        this.commentService.applyAction(this.comment.id, 'dislike')
          .subscribe(data => {

            if (this.comment && this.isLogged) {
              this.commentService.getCommentAction(this.comment.id)
                .subscribe(data => {
                  if (data.length > 0 && data[0].action) {
                    if (this.statusAction === 'like') {
                      this.likeCount --;
                    }
                    this.dislikeCount ++;
                    this.statusAction = data[0].action;
                  } else {
                    this.statusAction = '';
                    this.dislikeCount --;
                  }
                });
            }
          });
      }
    } else {
      this._snackBar.open('Чтобы поставить дизлайк войдите в свой аккаунт');
    }
  }
  complaint() {
    if (this.isLogged) {
      if (this.comment) {
        this.commentService.applyAction(this.comment.id, 'violate')
          .subscribe({
            next: (data: DefaultResponseType) => {
              if (data.error) {
                this._snackBar.open(data.message);
                throw new Error(data.message);
              }
              this._snackBar.open('Жалоба отправлена');
              //this.userInfoForm.markAsPristine();
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message);
              } else {
                this._snackBar.open('Непредвиденная ошибка');
              }
            }
          });
      }
    } else {
      this._snackBar.open('Чтобы отправить жалобу войдите в свой аккаунт');
    }
  }
}

