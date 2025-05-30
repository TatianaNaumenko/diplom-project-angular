import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ArticleService } from 'src/app/shared/services/article.service';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { ArticleType } from 'src/types/article.type';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  @ViewChild('popupThanks') popupThanks!: TemplateRef<ElementRef>;

  dialogRef: MatDialogRef<any> | null = null;
  dialogRefThanks: MatDialogRef<any> | null = null;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }
  reviewOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    margin: 25,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: false
  }
  reviews: {name: string, text: string, image: string}[] = [
    {
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
      image: 'image1.png'
    },
    {
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
      image: 'image2.png'
    },
    {
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
      image: 'image3.png'
    },
    {
      name: 'Ольга',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
      image: 'image3.png'
    },

  ]
  services: {image: string, title: string, text: string, price: string}[] = [
    {
      image: 'image1.png',
      title: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500'
    },
    {
      image: 'image2.png',
      title: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500'
    },
    {
      image: 'image3.png',
      title: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1 000'
    },
    {
      image: 'image4.png',
      title: 'Копирайтинг',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750'
    },

  ]

  serviceForm = this.fb.group({
    service: ['', [Validators.required, Validators.pattern(/^[А-Я][а-я]+/)]],
    name: ['', [Validators.required, Validators.pattern(/^[А-Я][а-я]+$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
  });

  articlesTop: ArticleType[] = []
  constructor(private dialog: MatDialog,
              private fb: FormBuilder,
              private articleService: ArticleService,
              private requestsService: RequestsService) {
  }

  ngOnInit() {
    this.articleService.getArticlesTop()
      .subscribe( (data: ArticleType[]) => {
        this.articlesTop = data;
      });
  }

  more(value: string) {
    this.serviceForm.markAsUntouched();

    this.serviceForm.setValue({
      service: value,
      name: '',
      phone: '',
    });
    this.dialogRef = this.dialog.open(this.popup);
  }

  closePopup(popup: string) {
    if (popup === 'popup') this.dialogRef?.close();
    else if (popup === 'popupThanks') this.dialogRefThanks?.close();
  }

  leaveInfo(type: string) {
    if (this.serviceForm.valid) {
      this.dialogRef?.close();
      this.dialogRefThanks = this.dialog.open(this.popupThanks);

      if (this.serviceForm.value.name && this.serviceForm.value.phone && this.serviceForm.value.service && type === 'order') {
        this.requestsService.sendRequest(this.serviceForm.value.name, this.serviceForm.value.phone.toString(),type , this.serviceForm.value.service)
      } else if (this.serviceForm.value.name && this.serviceForm.value.phone && type === 'consultation') {
        this.requestsService.sendRequest(this.serviceForm.value.name, this.serviceForm.value.phone.toString(), type)
      }
    }
  }
}
