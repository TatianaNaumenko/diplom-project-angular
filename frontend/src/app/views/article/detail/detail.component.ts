import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {DetailArticleType} from "../../../../types/detail-article.type";
import {environment} from "../../../../environments/environment.development";
import {ArticleType} from "../../../../types/article.type";
import {AuthService} from "../../../core/auth/auth.service";
import {UserService} from "../../../shared/services/user.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentService} from "../../../shared/services/comment.service";
import {CommentType} from "../../../../types/comment.type";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    article!: DetailArticleType;
    articlesRelated: ArticleType[] = [];
    serverStaticPath: string = environment.serverStaticPath;
    isLogged: boolean = false;
    userInfo: UserInfoType | null = null;
    comments: CommentType[] = [];
    comment: string | null = null;
    showSmallComments: boolean = true;
    commentActions: { comment: string, action: string }[] = []

    constructor(private activatedRoute: ActivatedRoute,
                private articleService: ArticleService,
                private authService: AuthService,
                private userService: UserService,
                private commentService: CommentService) {}

    ngOnInit() {
        this.showSmallComments = true;
        this.isLogged = this.authService.getIsLoggedIn();

        if (this.isLogged) {
            this.userService.getUserInfo()
                .subscribe((data: UserInfoType | DefaultResponseType) => {
                    if ((data as DefaultResponseType).error !== undefined) {
                        throw new Error((data as DefaultResponseType).message);
                    }

                    this.userInfo = data as UserInfoType;
                });
        }

        this.activatedRoute.params
            .subscribe(params => {
                this.articleService.getArticle(params['url'])
                    .subscribe((data: DetailArticleType) => {
                        this.article = data;

                        this.commentService.getComments({offset: 0, article: this.article.id})
                            .subscribe(data => {
                                if (data.comments.length > 0) {
                                  for (let i = 0; i < data.comments.length; i++) {
                                    if (data.comments[i]) {
                                      this.comments.push(data.comments[i]);
                                    }
                                  }
                                }
                            });

                        if (this.isLogged) {
                          this.commentService.getCommentsActions(this.article.id)
                            .subscribe(data => {
                              this.commentActions = data;
                            });
                        }
                    });

                this.articleService.getArticlesRelated(params['url'])
                    .subscribe((data: ArticleType[]) => {
                        this.articlesRelated = data;
                    });
            });
    }

    sendComment() {
        if (this.comment) {
            this.commentService.addComment(this.comment, this.article.id)
                .subscribe((data: DefaultResponseType) => {
                    this.commentService.getComments({offset: 0, article: this.article.id})
                        .subscribe(data => {
                            this.comments = data.comments;
                        });
                });
            this.comment = '';
        }
    }

    changeShowSmallComments() {
        this.showSmallComments = false;
        this.commentService.getComments({offset: 0, article: this.article.id})
            .subscribe(data => {
                this.comments = data.comments;
            });
    }
}
