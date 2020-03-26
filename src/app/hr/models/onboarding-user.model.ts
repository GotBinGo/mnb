import { UUID } from 'angular2-uuid';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IOnboardingUserDto, PictureFormat, OnboardingUserDto } from '@app/api/app.generated';

export class OnboardingUser extends OnboardingUserDto {
  name: string;
  image: string;
  fileName: string;
  pictureFormat: PictureFormat;
  jobDescription: string;
  introduction: string;
  isUsingAI = true;
  cid: string;

  localId: string;

  fileExtension: string;
  previewImage: string;
  isPreviewGenerating: boolean;

  constructor(dto: OnboardingUserDto = null) {
    super(dto);
    this.localId = UUID.UUID();
  }
}
