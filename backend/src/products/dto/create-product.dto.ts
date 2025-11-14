import { IsBoolean, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumberString()
  price!: string;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsInt()
  @IsOptional()
  sizeId?: number;

  @IsInt()
  @IsOptional()
  colorId?: number;
}
