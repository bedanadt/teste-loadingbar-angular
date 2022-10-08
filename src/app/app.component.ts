import { Component } from '@angular/core';
import Keyframe from './loading/Interfaces/Keyframe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'loading-teste-angular';


  get keyframes(): Keyframe[] {
    return [
      {
        time: 0,
        title: "loading",
        subtitle: "este é um subtitle",
        step: "Pegando munições",
      }, {
        time: 5,
        title: "5 segundos"
      }, {
        time: 10,
        subtitle: "este é um subtitle",
        step: "Carregando armas",
      }, {
        time: 15,
        title: "15 segundos",
        step: "Mirando",
      }, {
        time: 20,
        title: "20 segundos",
        step: "Atirando",
      }
    ];
  }
}
