import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../shared/modal/modal.service';
import { RAL_COLORS } from './colors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-megrendeles-details',
  templateUrl: './megrendeles-details.component.html',
  styleUrls: ['./megrendeles-details.component.scss']
})
export class MegrendelesDetailsComponent implements OnInit {
  radioItems = [{ value: 1, label: 'Egy' }, { value: 2, label: 'Kettő' }, { value: 3, label: 'Három' }];
  selectItems = [{ label: 'Label1', value: 1 }, { label: 'Label2', value: 2 }];
  multiselectItems = [
    { label: 'Label1', value: 1 },
    { label: 'Label2', value: 2 },
    { label: 'Label3', value: 3 },
    { label: 'Label4', value: 4 }
  ];
  ralColors = RAL_COLORS;

  form = new FormGroup({
    name: new FormControl('hello', [Validators.required]),
    check: new FormControl(false, [Validators.required]),
    radio: new FormControl(null, [Validators.required]),
    textarea: new FormControl(null, [Validators.required]),
    select: new FormControl(null, [Validators.required]),
    multiselect: new FormControl(null, [Validators.required]),
    datepicker: new FormControl(null, [Validators.required]),
    color: new FormControl(null, [Validators.required]),

    centerColor: new FormControl(null),
    leftColor: new FormControl(null),
    rightColor: new FormControl(null)
  });

  headModel: any = null;
  frameModel: any = null;

  constructor(private toastr: ToastrService, private modalService: ModalService) {}

  ngOnInit() {}

  showSuccess() {
    this.toastr.success('Valami success fontos üzenet', 'Fontos success');
  }

  showInfo() {
    this.toastr.info('Valami info fontos üzenet', 'Fontos info');
  }

  showError() {
    this.toastr.error('Valami error fontos üzenet', 'Fontos error');
  }

  showWarning() {
    this.toastr.warning('Valami warning fontos üzenet', 'Fontos warning');
  }

  showAlert() {
    this.modalService.alert('Valami alert fontos üzenet', 'Fontos alert');
  }

  showConfirm() {
    this.modalService.confirm('Valami confirm fontos üzenet', 'Fontos confirm');
  }
}
