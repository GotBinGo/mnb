import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  events = [
    {
      title: 'Regisztráció',
      icon: 'fa-calendar',
      img: '',
      date: '2020.03.28.',
      description: 'Ezen a napon hoztad létre a profilodat és kezdtél neki egy csodálatos és kalandos útnak.'
    },
    {
      title: 'Feladat 1',
      icon: 'fa-gamepad',
      img: 'assets/ages/cow.png',
      date: '2020.03.29.',
      description: 'Az útazás első állomásához értél, ahol egy játékos feladatban megmérettett a tudásod.'
    },
    {
      title: 'Feladat 3',
      icon: 'fa-award',
      img: 'assets/ages/paper.png',
      date: '2020.03.30.',
      description: 'Sikersen megoldottad a feladatot, méghozzá rekord idő alatt. Gratulálunk a teljesítményhez!'
    }
  ].reverse();

  constructor() {}

  ngOnInit() {}
}
