export class ErrorDto {
  title: string;
  message: string;
  details: string;

  validationErrors: { [key: string]: string[] };
}
