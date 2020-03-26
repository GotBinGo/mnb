import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-infotip',
  templateUrl: './infotip.component.html',
  styleUrls: ['./infotip.component.scss']
})
export class InfotipComponent implements OnInit {
  @Input()
  title: string | TemplateRef<any>;
  @Input()
  message: string | TemplateRef<any>;

  constructor() {}
  ngOnInit() {}
}
