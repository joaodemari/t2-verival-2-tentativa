import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadS3FileDTO {
  @ApiProperty({
    example: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
    description: 'URI do arquivo',
    required: true,
  })
  @IsNotEmpty({ message: 'URI do arquivo é obrigatório.' })
  @IsString()
  file: string;
}
