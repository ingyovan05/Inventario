import { PartialType } from '@nestjs/mapped-types';
import { CreateSizeDto } from './create-size.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
