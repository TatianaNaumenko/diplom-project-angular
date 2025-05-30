import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { ArticleType } from 'src/types/article.type';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit{

  @Input() article!: ArticleType;

  serverStaticPath = environment.serverStaticPath;
  constructor(private router: Router) {

  }

  ngOnInit() {
       console.log(this.serverStaticPath, this.article.image);
  }
}
