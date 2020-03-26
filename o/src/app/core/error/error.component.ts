import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  errors = {
    0: 'Hiba történt',
    403: 'Nincs joga a művelet végrehajtásához',
    404: 'A keresett oldal nem található'
  };

  constructor(public activatedRoute: ActivatedRoute) {}
}
