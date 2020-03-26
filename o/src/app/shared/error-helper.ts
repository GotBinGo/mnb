import { ApiException } from '../api/app.generated';
import { ErrorDto } from '../core/models/error';

export class ErrorHelper {
  static handleError(errorHandler: (err: Error | ApiException, dto: ErrorDto) => void) {
    return (error: Error) => {
      // 429 - too many request. aspnet rate limiting
      if (error instanceof ApiException && error.status !== 429) {
        const dto = this.apiExceptionToErrorDto(error);
        errorHandler(error, dto);
      } else {
        errorHandler(error, null);
      }
    };
  }

  static apiExceptionToErrorDto(error: ApiException): ErrorDto {
    return <ErrorDto>JSON.parse(error.response);
  }
}
