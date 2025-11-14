import { PartialType } from '@nestjs/mapped-types';
import { CreateSizeDto } from './create-size.dto.js';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {}

