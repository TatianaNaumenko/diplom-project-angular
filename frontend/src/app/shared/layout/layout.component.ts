import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: [
    `
    .wrapper {
      display: flex;
      flex-direction: column;
      height: 100%; // Устанавливаем высоту на 100% высоты родительского элемента
    }

    .content {
      flex: 1 0 auto; // Позволяет контенту занимать оставшееся пространство
    }

    app-footer {
      flex: 0 0 auto; // Фиксированная высота для футера
    }
    `
  ]

})
export class LayoutComponent {

}
