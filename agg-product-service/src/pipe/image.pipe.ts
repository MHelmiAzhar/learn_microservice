import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export class ParseImagePipe extends ParseFilePipe {
  constructor() {
    super({
      fileIsRequired: true,
      validators: [
        new FileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        }),
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * 2,
          message(maxSize) {
            return 'Validation failed (expected size is less than 2 Mb)';
          },
        }),
      ],
    });
  }
}
