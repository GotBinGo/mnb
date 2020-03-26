import { Component, OnInit } from '@angular/core';
import { OnboardingUser } from '@app/hr/models/onboarding-user.model';
import { NewsletterClient, OnboardingUserDto, PictureFormat, PreviewPictureDto, SendOnboardingNewsletterDto } from '@app/api/app.generated';
import { SpinnerService } from '@app/shared/loading-spinner/spinner.service';
import { finalize } from 'rxjs/operators';
import { ModalService } from '@app/shared/modal/modal.service';
import { MatDialog } from '@angular/material';
import { CropimageModalComponent } from './cropimage-modal/cropimage-modal.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {
  users: OnboardingUser[] = [];
  imageChangedEvent: any = '';
  userForms: {
    key: string;
    value: FormGroup;
  }[] = [];

  subjectForm: FormGroup;

  constructor(
    private newsletterClient: NewsletterClient,
    private spinnerService: SpinnerService,
    private modalService: ModalService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.spinnerService.show();
    this.addUser();
    this.subjectForm = new FormGroup({
      subject: new FormControl('Welcome Onboard!', [Validators.required])
    });
    this.spinnerService.hide();
  }

  addUser() {
    const user = new OnboardingUser();
    this.users.push(user);
    this.userForms.push({
      key: user.localId,
      value: new FormGroup({
        name: new FormControl('', [Validators.required]),
        role: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required])
      })
    });
  }

  deleteUser(user: OnboardingUser) {
    this.users = this.users.filter(x => x.localId !== user.localId);
    this.userForms = this.userForms.filter(x => x.key !== user.localId);

    if (this.users.length < 1) {
      this.addUser();
    }
  }

  sendButtonInactive(): boolean {
    return this.users.some(x => x.image && x.isPreviewGenerating);
  }

  async getPreview(user: OnboardingUser) {
    await this.modalService
      .image(user.previewImage, user.fileExtension, 'Profilkép előnézet')
      .afterClosed()
      .toPromise();
  }

  async cropProfilePicture(user: OnboardingUser) {
    const dialogRef = this.dialog.open(CropimageModalComponent, { minWidth: '35vw', maxWidth: '90vw', disableClose: false });
    dialogRef.componentInstance.imageChangedEvent = this.imageChangedEvent;
    const result = await dialogRef.afterClosed().toPromise();

    if (result != null) {
      user.isPreviewGenerating = true;
      user.image = result;
      user.isUsingAI = false;

      const pictureFormat = user.fileExtension.toLowerCase() === 'jpg' ? PictureFormat.Jpg : PictureFormat.Png;
      this.newsletterClient
        .getPreviewOfPicture(
          new PreviewPictureDto({
            picture: user.image.split('base64,')[1], // TODO javítani
            pictureFormat: pictureFormat,
            isCropped: true
          })
        )
        .subscribe(x => {
          user.isPreviewGenerating = false;
          user.previewImage = x;
        });
    }
  }

  async onFileSelect(user: OnboardingUser, event: any) {
    if (event.target.files.length < 1) {
      return;
    }

    if ((event.target.files[0] as File).size > 5000000) {
      await this.modalService
        .alert('A fájl mérete túl nagy, válasszon kisebbet!', 'Fájlméret hiba')
        .afterClosed()
        .toPromise();
      return;
    }

    this.imageChangedEvent = event;
    const file = event.target.files[0];
    const extension = file.name.split('.').pop();

    if (extension.toLowerCase() !== 'jpg' && extension.toLowerCase() !== 'jpeg' && extension.toLowerCase() !== 'png') {
      this.modalService.alert('Nem megfelelő képformátumot választott! Megengedett kiterjesztések: jpg, png');
      return;
    }

    user.fileName = file.name;
    user.fileExtension = extension;

    const reader = new FileReader();

    reader.onloadend = e => {
      user.isPreviewGenerating = true;
      user.image = reader.result as string;

      const pictureFormat = user.fileExtension.toLowerCase() === 'jpg' ? PictureFormat.Jpg : PictureFormat.Png;
      this.newsletterClient
        .getPreviewOfPicture(
          new PreviewPictureDto({
            picture: user.image.split('base64,')[1], // TODO javítani
            pictureFormat: pictureFormat,
            isCropped: false
          })
        )
        .subscribe(x => {
          user.isPreviewGenerating = false;
          user.previewImage = x;
        });
    };

    reader.readAsDataURL(file);
  }

  getUserForm(user: OnboardingUser) {
    return this.userForms.filter(f => f.key === user.localId).pop().value;
  }

  sendOnBoardingNewsletter() {
    let isValid = true;
    this.userForms.forEach(x => (isValid = isValid && x.value.valid));
    isValid = isValid && this.subjectForm.valid;

    if (isValid) {
      this.spinnerService.show();
      const users = this.users.map(x => {
        const form = this.getUserForm(x);

        return new OnboardingUserDto({
          name: form.controls.name.value,
          jobDescription: form.controls.role.value,
          introduction: form.controls.description.value,
          image: x.previewImage,
          pictureFormat: x.previewImage
            ? x.fileExtension.toLowerCase() === 'jpg'
              ? PictureFormat.Jpg
              : PictureFormat.Png
            : PictureFormat.Jpg,
          fileName: x.fileName,
          isUsingAI: x.isUsingAI
        });
      });

      this.newsletterClient
        .sendOnboardingNewsLetter(
          new SendOnboardingNewsletterDto({
            users: users,
            subject: this.subjectForm.controls.subject.value
          })
        )
        .pipe(finalize(() => this.spinnerService.hide()))
        .subscribe();
    }
  }
}
