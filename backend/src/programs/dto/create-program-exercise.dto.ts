import { IsInt, IsString, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class CreateProgramExerciseDto {
  @IsInt()
  exerciseId: number;

  @IsInt()
  @Min(1)
  order: number;

  @IsInt()
  @Min(1)
  @Max(50)
  sets: number;

  @IsString()
  reps: string; // "8-12", "10", "AMRAP", "30 seconds", etc.

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number; // suggested weight in kg

  @IsInt()
  @Min(15)
  @Max(600)
  restPeriod: number; // seconds

  @IsOptional()
  @IsString()
  tempo?: string; // "3-1-2-1" (eccentric-pause-concentric-pause)

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rpe?: number; // Rate of Perceived Exertion 1-10

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isSuperset?: boolean;

  @IsOptional()
  @IsInt()
  supersetGroup?: number;
}