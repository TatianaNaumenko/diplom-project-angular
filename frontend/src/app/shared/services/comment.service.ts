import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentType} from "../../../types/comment.type";
import { CommentActionType } from 'src/types/comment-action.type';


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: text,
      article: article
    });
  }

  getComments(params: {offset: number, article: string}): Observable<{count: number, comments: CommentType[]}> {
    return this.http.get<{count: number, comments: CommentType[]}>(environment.api + 'comments', {params});
  }

  applyAction(commentId: string, action: string) {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {"action": action})
  }

  getCommentsActions(id: string): Observable<CommentActionType[]> {
    return this.http.get<CommentActionType[]>(environment.api + 'comments/article-comment-actions?articleId=' + id);
  }

  getCommentAction(id: string): Observable<CommentType[]> {
    return this.http.get<CommentType[]>(environment.api + 'comments/' + id + '/actions');
  }
}
