import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {DetailComponent} from "./detail/detail.component";
import { BlogComponent } from './blog/blog.component';

const routes: Routes = [
  {path: 'blog', component: BlogComponent},
  {path: 'article/:url', component: DetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
