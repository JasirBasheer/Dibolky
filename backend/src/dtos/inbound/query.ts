import { IsNumber, IsOptional, IsString } from "class-validator";

export class QueryDto {
  @IsNumber()
  page!: number;

  @IsNumber()
  limit!: number;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  sortOrder?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
