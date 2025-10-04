import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateWeightEntryDto {
  @IsNumber()
  @Min(20) // Minimum reasonable weight in kg
  @Max(500) // Maximum reasonable weight in kg
  weight: number;

  @IsOptional()
  @IsString()
  notes?: string;
}