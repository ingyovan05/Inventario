import { IsInt, IsPositive } from 'class-validator';

export class RestockDto {
  @IsInt()
  @IsPositive()
  quantity!: number;
}

