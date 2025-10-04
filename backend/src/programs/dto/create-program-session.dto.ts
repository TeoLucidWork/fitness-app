import { IsString, IsOptional, IsInt, IsBoolean, Min, Max } from 'class-validator';

export class CreateProgramSessionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek?: number; // 1 = Monday, 7 = Sunday

  @IsInt()
  @Min(1)
  weekNumber: number;

  @IsInt()
  @Min(1)
  order: number;

  @IsOptional()
  @IsBoolean()
  restDay?: boolean;
}