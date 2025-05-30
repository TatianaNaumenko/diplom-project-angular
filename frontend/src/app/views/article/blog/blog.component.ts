import {Component, HostListener, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../../shared/services/article.service";
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtils} from "../../../shared/utils/active-params.utils";
import { AppliedFilterType } from 'src/types/applied-filter.type';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit{

  articles: ArticleType[] = [];
  pages: number[] = []
  categories: CategoryType[] = [];
  categoryOpen: boolean = false;
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  page: number = 1;

  constructor(private articleService: ArticleService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.articleService.getCategories()
      .subscribe((data: CategoryType[]) => {
        this.categories = data;

        this.activatedRoute.queryParams
          .subscribe(params => {
            this.activeParams = ActiveParamsUtils.processParams(params);

            this.appliedFilters = [];
            this.activeParams.categories.forEach(url => {
              const paramName = this.categories.find(item => item.url === url);

              if (paramName) {
                this.appliedFilters.push({
                  name: paramName.name,
                  urlParam: url
                })
              }
            })

            this.articleService.getArticles(this.activeParams)
              .subscribe(data => {
                this.articles = data.items;
                this.pages = [];

                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }
              });
          })
      });
  }

  toggle() {
    this.categoryOpen = !this.categoryOpen;
  }

  updateCategories(url: string) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParams = this.activeParams.categories.find(item => item == url);

      if (existingCategoryInParams) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item != url);
      } else {
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else {
      this.activeParams.categories = [...this.activeParams.categories, url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);
    this.activeParams.page = 1;

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPage(page: number) {
    this.activeParams.page = page;

    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page --;

      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }
  openNextPage() {
    if (!this.activeParams.page) {
      this.activeParams.page = 1;
    }
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page ++;

      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    try {
      if (this.categoryOpen && (event.target as HTMLElement).className.indexOf('blog-filter') === -1) {
        this.categoryOpen = false;
      }
    } catch (error){}
  }
}
