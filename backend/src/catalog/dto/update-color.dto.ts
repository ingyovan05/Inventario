import { PartialType } from '@nestjs/mapped-types';
import { CreateColorDto } from './create-color.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateColorDto extends PartialType(CreateColorDto) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
